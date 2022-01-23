const e = require('express');
const express = require('express');
var router = express.Router()

const mysqlConnection = require('../../database/db_auth.js')


const WebSocketServer = new require('ws');
const wss = new WebSocketServer.Server({ port: 3001 });

var VISITORS = []
var AGENTS = []
var AGENT_VISITOR_PAIR = {}

var userSession

router.get("/visitor", isLoggedIn, (req, res) => {
    var sess = req.session;
    userSession = req.session

    mysqlConnection.query('SELECT * FROM chats WHERE from_id = ? OR to_id= ?', [sess.acc_id, sess.acc_id], function (error, results, fields) {
        if (results.length > 0) {
            res.render('websockets/visitor', {
                username: sess.username,
                acc_id: sess.acc_id,
                chats: results,
                status: true
            });
        } else {
            res.render('websockets/visitor', {
                username: sess.username,
                acc_id: sess.acc_id,
                chats: [],
                status: true
            });
        }
    });


});


function getVisitors(callback) {
    mysqlConnection.query('SELECT acc_id,username FROM users WHERE position = "Visitor"', function (error, results, fields) {
        if (results.length > 0) {
            callback(results)
            return
         }
    });

    callback([])
}


router.get("/agent", isLoggedIn, (req, res) => {
    var sess = req.session;
    userSession = req.session
    getVisitors(function(visitors) {
        if (visitors.length > 0) {
            res.render('websockets/agent', {
                username: sess.username,
                acc_id: sess.acc_id,
                visitors: visitors,
                status: true
            });
        } 
    });
});

router.get("/api/getvisitorchat", (req, res) => {
    mysqlConnection.query('SELECT * FROM chats WHERE from_id = ? OR to_id= ?', [req.query.visitorId,req.query.visitorId], function (error, results, fields) {
        res.send(results)
    });
});



function isLoggedIn(req, res, next) {
    var sess = req.session;
    if (sess.username) {
        return next();
    }
    res.redirect('/');
}

router.post("/api/notify", function (req, res) {
    let response = {}
    let message = req.body.message
    response["type"] = "notification"
    response["message"] = message
    sendAll(JSON.stringify(response))
    res.send("Notification sent to all Connected users!")
});


let sendAll = (message) => {
    for (let i = 0; i < VISITORS.length; i++) {
        VISITORS[i].send(message);
    }
}

let getAvailableAgent = () => {
    let matched = Object.keys(AGENT_VISITOR_PAIR).filter(function (key) {
        return AGENT_VISITOR_PAIR[key] === "Not Assigned";
    });
    let agentId = matched.find((_, i, ar) => Math.random() < 1 / (ar.length - i));
    return agentId
}

let sendMsgToAgent = (id, message) => {

    let inConversation = false

    message = JSON.parse(message)
    let response = {}
    response["visitor_id"] = id
    response['message'] = message.message

    Object.keys(AGENT_VISITOR_PAIR).forEach(function (agent_id) {
        if (AGENT_VISITOR_PAIR[agent_id] == id) {
            // console.log('This visitor is already in conversation with agent');
            AGENTS[agent_id].send(JSON.stringify(response))
            inConversation = true

            let chat = {}
            chat.from_id = id
            chat.to_id = agent_id
            chat.text = message.message
            storeChatToDatabase(chat)

            return
        }
    });

    if (inConversation === false) {
        // console.log("also came here!")
        let availableAgentId = getAvailableAgent()
        AGENTS[availableAgentId].send(JSON.stringify(response))
        AGENT_VISITOR_PAIR[availableAgentId] = id

        let chat = {}
        chat.from_id = id
        chat.to_id = availableAgentId
        chat.text = message.message
        storeChatToDatabase(chat)
    }
}

let sendMsgToVisitor = (id, message) => {
    message = JSON.parse(message)
    let response = {}
    response["type"] = "chat"
    response['message'] = message.message
    VISITORS[message.visitor_id].send(JSON.stringify(response))

    let chat = {}
    chat.from_id = id
    chat.to_id = message.visitor_id
    chat.text = message.message

    storeChatToDatabase(chat)
}

let storeChatToDatabase = (chat) => {
    mysqlConnection.query('INSERT INTO chats SET ?', chat, function (error, results, fields) {
        if (error) throw error;
    });
}


wss.on('connection', (ws, req) => {

    var id

    if (req.url == "/ws/visitor") {
        id = userSession.acc_id
        console.log("visitor - " + id + " Joined!")
        VISITORS[id] = ws;
        VISITORS.push(ws);
    }
    else if (req.url == "/ws/agent") {
        id = userSession.acc_id
        console.log("agent - " + id + " Joined!")
        AGENTS[id] = ws;
        AGENTS.push(ws);
        AGENT_VISITOR_PAIR[id] = "Not Assigned"
    }


    ws.on('message', function (data) {
        if (req.url == "/ws/visitor") {
            sendMsgToAgent(id, data)
        } else if (req.url == "/ws/agent") {
            console.log(data)
            sendMsgToVisitor(id, data)
        }
    });

    ws.on('close', function () {
        if (id in VISITORS) {
            console.log("visitor - " + id + " left!")
            delete VISITORS[id];

            Object.keys(AGENT_VISITOR_PAIR).forEach(function (agent_id) {
                if (AGENT_VISITOR_PAIR[agent_id] == id) {
                    AGENT_VISITOR_PAIR[agent_id] = "Not Assigned"
                }
            });

        } else if (id in AGENTS) {
            console.log("agent - " + id + " left!")
            delete AGENTS[id];
            delete AGENT_VISITOR_PAIR[id]
        }
    });
})

module.exports = router