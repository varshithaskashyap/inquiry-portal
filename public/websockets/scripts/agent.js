var user = {};
user.avatar = "/websockets/images/user.png";

var bot = {};
bot.avatar = "/websockets/images/bot.png";

var ws

function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function insertChat(who, visitor_id, text) {

    var chat = "";
    var date = formatTime(new Date());

    if (who == "user") {
        chat = 
        `
        <li class="list-group-item list-group-item-dark mt-3">
            <p class="float-left">${visitor_id}</p>
            <p class="text-right ">${text}
                <img src="${bot.avatar}" class="rounded float-right" alt="bot">
            </p>
            <small class="float-left text-secondary">${date}</small><br>
        </li>
        `;
    } else {
        chat = 
        `
        <li class="list-group-item mt-3 ">
        <p class="float-right">Visitor</p>

            <p class="text-left">
                <img src="${user.avatar}"
                    class="rounded float-left" alt="user">
                ${text}
            </p>
            <small class="float-right text-secondary">${date}</small><br>
        </li>`;
    }
    $("#chat-screen").append(chat).scrollTop($("ul").prop('scrollHeight'));
}


function sendChat(visitor_id) {
    var text = $("#inputText").val().trim();
    if (text !== "") {
        insertChat("user","",text);
        ws.send(JSON.stringify({
            visitor_id : visitor_id,
            message: text             
        }));
        $("#inputText").val('');
    }
}


function showVisitorChat(clicked_id) { 
        clicked_id = parseInt(clicked_id)   
        $(".visitorname").removeClass("bg-primary text-white")
        $("."+clicked_id).addClass("bg-primary text-white") 

        $.ajax({
            url: "/api/getvisitorchat",
            type: "GET", 
            data: { 
                visitorId: clicked_id, 
            },
            success: function(result) {
                let chatsrceen = 
                `
                <div class="form-group">
                <ul class="list-group" id="chat-screen">
    
                </ul>
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control inputText" id="inputText" placeholder="Type here" aria-label="inputText"
                    aria-describedby="button-addon2">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary submit" type="button" id="submit">send</button>
                </div>
            </div>
                `
                $(".visitorchat").html(chatsrceen)
    
    
                for(let i=0;i<result.length;i++) {
                    if(result[i].from_id === clicked_id) {
                        insertChat("bot", clicked_id , result[i].text)
                    } else {
                        insertChat("user", "Agent" , result[i].text)
                    }
                }


                $(".inputText").on("keydown", function (e) {
                    console.log("a")
                    if (e.which == 13) {
                        console.log(clicked_id)
                        sendChat(clicked_id);
                    }
                });
            
                $('.submit').click(function () {
                    sendChat(clicked_id);
                });  




            },
            error: function(errMsg) {
            }
          });

}


$(document).ready(function () {
    console.log("hello world")
    var visitor_id = ""

    var url = 'ws://'+document.location.hostname+':3001/ws/agent' ;
    ws = new WebSocket(url);

    ws.onopen = function () {
        console.log("connected to websocket")
    }

    ws.onmessage = function (data) {
        console.log(data.data)
        let userResponse = JSON.parse(data.data)
        visitor_id = userResponse.visitor_id
        showVisitorChat(visitor_id)
        insertChat("user",visitor_id,userResponse.message)
    };

    $(".inputText").on("keydown", function (e) {
        console.log("a")
        if (e.which == 13) {
            console.log(visitor_id)
            sendChat(visitor_id);
        }
    });

    $('.submit').click(function () {
        sendChat(visitor_id);
    });    
})