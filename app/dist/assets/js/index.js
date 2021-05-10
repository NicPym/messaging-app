//Main Execution of program
let conversations = [];
let messages = [];
let currentConversation = null;
function init() {

    let token = getCookie("token");
    let username = getCookie("username");
    if (token && username) {
        setInnerHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Select a Conversation to see the messages!</label><div class="d-flex flex-fill" style="width:0;"></div><label style="margin:0 30px;font-size:20px;" onclick="toggleLogin()" id="loginBtn">Logout</label></div>`);
        loadConversations()
    }
    else{
        prependHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Login to see conversations and messsages!</label>`)
    }
}

function loadMessages(conversationId) {
    currentConversation = conversationId;
    console.log(`Loading Messages with conversationId: ${conversationId}`)
    let messageArr = [];
    let personTo = ""
    let username = getCookie("username");
    conversations.forEach(conversation => {
        if (conversation.conversationId === conversationId) {
            messageArr = conversation.messages;
            personTo = conversation.user1 === username ? conversation.user2 : conversation.user1;
        }
    });

    let login = getInnerHtml("loginBtn");
    setInnerHtml("personTo", `<div class="d-flex flex-fill" style="width:0;"></div><label style="margin:0 30px;font-size:20px;" onclick="toggleLogin()" id="loginBtn">${login}</label></div>`)

    if(personTo === ""){
        prependHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Select a Conversation to see the messages!</label>`)
    }else{
        prependHtml("personTo",`<img src="assets/img/profile_picture.png" style="width:40px;height:40px;margin:0 10px 0 20px;"><label style="margin:0 10px;font-size:20px;">${personTo}</label>`)
    }

    setInnerHtml("messages","");

    messageArr.forEach(message => {
        displayMessage(message)
    });
}

function getMessageReceivedHtml(body, timestamp) {
    return `
        <div class="d-flex flex-column">
            <div class="d-flex flex-row flex-grow-1 align-items-end align-content-start">
                <div class="card d-flex flex-column" style="margin:20px;max-width:50%;box-shadow:1px 1px 5px grey;">
                    <div class="d-flex flex-row" style="padding:10px;height:90%;">
                        <p style="margin:0px;">${body}</p>
                    </div>
                    <div class="d-flex flex-row justify-content-end align-items-start" style="height:10%;padding:5px;">
                        <p style="font-size:12px;margin:2px 10px;">${timestamp}</p>
                    </div>
                </div>
            </div>
        </div>`;
}

function getMessageSentHtml(body, timestamp) {
    return `
        <div class="d-flex flex-column">
            <div class="d-flex flex-row justify-content-end align-items-end">
                <div class="card d-flex flex-column" style="margin:20px;max-width:50%;background-color:rgb(220,248,198);box-shadow:1px 1px 5px grey;">
                    <div class="d-flex flex-row" style="padding:10px;height:90%;">
                        <p style="margin:0px;">${body}</p>
                    </div>
                    <div class="d-flex flex-row justify-content-end align-items-start" style="height:10%;padding:5px;">
                        <p style="font-size:12px;margin:2px 10px;">${timestamp}</p>
                    </div>
                </div>
            </div>
        </div>`;
}

function getConversationHtml(id, name) {
    return `
        <div class="d-flex align-items-center" style="height:60px;" onclick="loadMessages(${id})">
            <img src="assets/img/profile_picture2.png" style="width:50px;height:50px;margin:0 10px 0 20px;">
            <label style="margin:0 10px;font-size:18px;">${name}</label>
        </div>
        <hr>`;
}

function displayMessage(message) {
    let messageHtml = ""
    let username = getCookie("username");
    if (message.sender !== username) {
        messageHtml += getMessageReceivedHtml(message.description, message.timestamp);
            
    } else {
        messageHtml += getMessageSentHtml(message.description, message.timestamp);
    }
    appendHtml("messages", messageHtml)
}

function displayConversation(conversation) {
    let username = getCookie("username")
    let person = username === conversation.user1 ? conversation.user2 : conversation.user1;
    appendHtml("conversations", getConversationHtml(conversation.conversationId, person));
}

function loadConversations() {
    console.log("Loading Conversations")
    // TODO: api call to server
    let conversation = {
        conversationId: 1,
        user1: "Duncan",
        user2: "Stuart",
        messages: [
            {
                conversationId:1,
                sender: "Duncan",
                description: "Hi Stuart",
                timestamp: "2021-05-08 16:10"
            },
            {
                conversationId:1,
                sender: "Stuart",
                description: "Sup Duncan :)",
                timestamp: "2021-05-08 16:15"
            }
        ]
    }
    conversations.push(conversation);
    conversation = {
        conversationId: 2,
        user1: "Raymond",
        user2: "Duncan",
        messages: [
            {
                conversationId:2,
                sender: "Raymond",
                description: "olo Duncan",
                timestamp: "2021-05-06 11:00"
            },
            {
                conversationId:2,
                sender: "Duncan",
                description: "Booiiiiii",
                timestamp: "2021-05-07 07:10"
            }
        ]
    }
    conversations.push(conversation);

    setInnerHtml("conversations","<hr>");
    let username = getCookie("username");
    conversations.forEach(conversation => {
        displayConversation(conversation);
    });

}

function toggleLogin() {
    if (getInnerHtml("loginBtn") === "Login") {
        googleAuth()
        setInnerHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Select a Conversation to see the messages!</label><div class="d-flex flex-fill" style="width:0;"></div><label style="margin:0 30px;font-size:20px;" onclick="toggleLogin()" id="loginBtn">Logout</label></div>`);
        loadConversations();
    } else {
        deleteCookie("token");
        deleteCookie("username");
        setInnerHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Login to see conversations and messsages!</label><div class="d-flex flex-fill" style="width:0;"></div><label style="margin:0 30px;font-size:20px;" onclick="toggleLogin()" id="loginBtn">Login</label></div>`)
        clearConversations();
        clearMessages();
    }

}

function clearMessages() {
    messages = [];
    setInnerHtml("messages", "")
}

function clearConversations() {
    conversations = [];
    setInnerHtml("conversations", "")
}

function googleAuth() {
    // TODO: google auth here set token and username

    let token = "1234"
    let username = "Duncan"
    setCookie("token", token);
    setCookie("username", username);
}

function addSmiley() {
    document.getElementById("messageToSend").value += ":)"; // Brilliant XD
}

function recieve_message(message) {
     conversations.forEach(conversation => {
        if(conversation.conversationId === message.conversationId){
            conversation.messages.push(message);
        }
     });

     if(message.conversationId === currentConversation){
        displayMessage(message)
     }
}

function recieve_conversation(conversation) {
    conversations.push(conversation)
    let username = getCookie("username");
    let person = username === conversation.user1 ? conversation.user2 : conversation.user1;
    prependHtml("conversations", getConversationHtml(conversation.conversationId, person));
}

function send_conversation() {

}

function send_message() {
    let currentConversationId = currentConversation;
    let message = document.getElementById("messageToSend").value;
    let username = getCookie("username");
    console.log(`sending message: ${message}`)
    document.getElementById("messageToSend").value = "";
    let date = formatDate(new Date());

    let messageObj = {
        conversationId:currentConversationId,
        sender: username,
        description: message,
        timestamp: date
    }
    conversations.forEach(conversation => {
        if(conversation.conversationId === currentConversationId){
            conversation.messages.push(message)
        }
    })
    displayMessage(messageObj);
}

function getInnerHtml(id) {
    return document.getElementById(id).innerHTML
}

function setInnerHtml(id, html) {
    document.getElementById(id).innerHTML = html;
}

function setCookie(cname, object) {
    object = JSON.stringify(object)
    window.localStorage.setItem(cname, object)
}

function getCookie(cname) {
    return JSON.parse(window.localStorage.getItem(cname));
}

function deleteCookie(cname) {
    window.localStorage.removeItem(cname);
}

function prependHtml(id, html) {
    document.getElementById(id).innerHTML = html + document.getElementById(id).innerHTML;
}

function appendHtml(id, html) {
    document.getElementById(id).innerHTML = document.getElementById(id).innerHTML + html;
}

function formatDate(date) {
    let d = new Date()
    let ret = date.toISOString().slice(0, 10)
    ret += " "+ d.getHours()+":"+d.getMinutes()
    return ret
}

