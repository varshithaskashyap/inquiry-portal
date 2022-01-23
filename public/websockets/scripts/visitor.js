var user = {};
user.avatar = "/websockets/images/user.png";

var bot = {};
bot.avatar = "/websockets/images/bot.png";

var ws

function formatTime(date) {

    var hours
    var minutes

    if(typeof(date) === 'string') {
        var d = new Date(date);
        hours = d.getUTCHours(); 
       minutes = d.getUTCMinutes();
    } else {
        hours = date.getHours();
        minutes = date.getMinutes();
    }


    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


function insertChat(who, text) {

    var chat = "";
    var date = formatTime(new Date());

    if (who == "user") {
        chat = 
        `
        <li class="list-group-item list-group-item-dark mt-3">
            <p class="float-left">You</p>
            <p class="text-right ">${text}
                <img src="${user.avatar}"
                    class="rounded float-right" alt="user">
            </p>
            <small class="float-left text-secondary">${date}</small><br>
        </li>
        `;
    } else {
        chat = 
        `
                <li class="list-group-item mt-3 ">
                <p class="float-right">Agent</p>

                    <p class="text-left">
                        <img src="${bot.avatar}" class="rounded float-left" alt="bot">
                        ${text}
                    </p>
                    <small class="float-right text-secondary">${date}</small><br>
                </li>`;
    }
    $("#chat-screen").append(chat).scrollTop($("ul").prop('scrollHeight'));
}


function sendChat() {
    var text = $("#inputText").val().trim();
    if (text !== "") {
        insertChat("user", text);
        ws.send(JSON.stringify({
            // visitor_id : visitorId,
            message: text             
        }));
        $("#inputText").val('');
    }
}

$(document).ready(function () {
    var url = 'ws://'+document.location.hostname+':3001/ws/visitor' ;
    ws = new WebSocket(url);

    ws.onopen = function () {
        console.log("connected to websocket")
    }

    ws.onmessage = function (data) {
        let agentResponse = JSON.parse(data.data)
        if(agentResponse.type == "chat") {
            insertChat("bot",agentResponse.message)
        } else {
            alert(agentResponse.message)
        }
    };

    $("#inputText").on("keydown", function (e) {
        if (e.which == 13) {
            sendChat();

        }
    });

    $('#submit').click(function () {
        sendChat();
    });
})
