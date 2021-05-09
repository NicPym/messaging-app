//Main Execution of program
let chats = [];
let messages = [];
let currentChat = null;
function init() {

    let token = getCookie("token");
    let username = getCookie("username");
    if (token && username) {
        setInnerHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Select a Chat to see the messages!</label><div class="d-flex flex-fill" style="width:0;"></div><label style="margin:0 30px;font-size:20px;" onclick="toggleLogin()" id="loginBtn">Logout</label></div>`);
        loadChats()
    }
    else{
        prependHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Login to see chats and messsages!</label>`)
    }
}

function loadMessages(chatId) {
    currentChat = chatId;
    console.log(`Loading Messages with chatId: ${chatId}`)
    let messageArr = [];
    let personTo = ""
    let username = getCookie("username");
    chats.forEach(chat => {
        if (chat.chatId === chatId) {
            messageArr = chat.messages;
            personTo = chat.user1 === username ? chat.user2 : chat.user1;
        }
    });

    let login = getInnerHtml("loginBtn");
    setInnerHtml("personTo", `<div class="d-flex flex-fill" style="width:0;"></div><label style="margin:0 30px;font-size:20px;" onclick="toggleLogin()" id="loginBtn">${login}</label></div>`)

    if(personTo === ""){
        prependHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Select a Chat to see the messages!</label>`)
    }else{
        prependHtml("personTo",`<img src="assets/img/profile_picture.png" style="width:40px;height:40px;margin:0 10px 0 20px;"><label style="margin:0 10px;font-size:20px;">${personTo}</label>`)
    }

    setInnerHtml("messages","");

    messageArr.forEach(message => {
        displayMessage(message)
    });


}

function displayMessage(message){
    let messageHtml = ""
    let username = getCookie("username");
    if (message.sender !== username) {
        messageHtml += `
            <div class="d-flex flex-column" style="width:100%;">
                <div class="d-flex flex-row flex-grow-1 align-items-end align-content-start" style="width:100%;">
                    <div class="card d-flex flex-column" style="margin:20px;max-width:50%;box-shadow:1px 1px 5px grey;">
                        <div class="d-flex flex-row" style="padding:10px;width:100%;height:90%;">
                            <p style="margin:0px;">${message.description}</p>
                        </div>
                        <div class="d-flex flex-row justify-content-end align-items-start" style="width:100%;height:10%;padding:5px;">
                            <p style="font-size:12px;margin:2px 10px;">${message.timestamp}</p>
                        </div>
                    </div>
                </div>
            </div>`
    } else {
        messageHtml += `
            <div class="d-flex flex-column" style="width:100%;">
                <div class="d-flex flex-row justify-content-end align-items-end" style="width:100%;">
                    <div class="card d-flex flex-column" style="margin:20px;max-width:50%;background-color:rgb(220,248,198);box-shadow:1px 1px 5px grey;">
                        <div class="d-flex flex-row" style="padding:10px;width:100%;height:90%;">
                            <p style="margin:0px;">${message.description}</p>
                        </div>
                        <div class="d-flex flex-row justify-content-end align-items-start" style="width:100%;height:10%;padding:5px;">
                            <p style="font-size:12px;margin:2px 10px;">${message.timestamp}</p>
                        </div>
                    </div>
                </div>
            </div>`
    }
    appendHtml("messages", messageHtml)
}

function displayChat(chat){
    let username = getCookie("username")
    let person = username === chat.user1 ? chat.user2 : chat.user1;
    let chatHtml = `
        <div class="d-flex align-items-center" style="height:10%;width:100%;" onclick="loadMessages(${chat.chatId})">
            <img src="assets/img/profile_picture2.png" style="width:40px;height:40px;margin:0 10px 0 20px;">
            <label style="margin:0 10px;font-size:20px;">${person}</label>
       </div>
   <hr>`
    appendHtml("chats", chatHtml);
}
function loadChats() {
    console.log("Loading Chats")
    //Todo: api call to server
    let chat = {
        chatId: 1,
        user1: "Duncan",
        user2: "Stuart",
        messages: [
            {
                chatId:1,
                sender: "Duncan",
                description: "Hi Stuart",
                timestamp: "2021-05-08 16:10"
            },
            {
                chatId:1,
                sender: "Stuart",
                description: "Sup Duncan :)",
                timestamp: "2021-05-08 16:15"
            }
        ]
    }
    chats.push(chat);
    chat = {
        chatId: 2,
        user1: "Raymond",
        user2: "Duncan",
        messages: [
            {
                chatId:2,
                sender: "Raymond",
                description: "olo Duncan",
                timestamp: "2021-05-06 11:00"
            },
            {
                chatId:2,
                sender: "Duncan",
                description: "Booiiiiii",
                timestamp: "2021-05-07 07:10"
            }
        ]
    }
    chats.push(chat);

    setInnerHtml("chats","<hr>");
    let username = getCookie("username")
    chats.forEach(chat => {
        displayChat(chat);
    });

}

function toggleLogin() {
    if (getInnerHtml("loginBtn") === "Login") {
        googleAuth()
        setInnerHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Select a Chat to see the messages!</label><div class="d-flex flex-fill" style="width:0;"></div><label style="margin:0 30px;font-size:20px;" onclick="toggleLogin()" id="loginBtn">Logout</label></div>`);
        loadChats();
    } else {
        deleteCookie("token");
        deleteCookie("username");
        setInnerHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Login to see chats and messsages!</label><div class="d-flex flex-fill" style="width:0;"></div><label style="margin:0 30px;font-size:20px;" onclick="toggleLogin()" id="loginBtn">Login</label></div>`)
        clearChats();
        clearMessages();
    }

}

function clearMessages() {
    messages = [];
    setInnerHtml("messages", "")
}

function clearChats() {
    chats = [];
    setInnerHtml("chats", "")
}

function googleAuth() {
    //Todo: google auth here set token and username

    let token = "1234"
    let username = "Duncan"
    setCookie("token", token);
    setCookie("username", username);
}

function addSmiley() {
    document.getElementById("messageToSend").value += ":)";
}

function recieve_message(message){
     chats.forEach(chat => {
        if(chat.chatId === message.chatId){
            chat.messages.push(message);
        }
     });

     if(message.chatId === currentChat){
        displayMessage(message)
     }
}

function recieve_chat(chat){
    chats.push(chat)
    let username = getCookie("username");
    let person = username === chat.user1 ? chat.user2 : chat.user1;
    chatHtml = `
    <div class="d-flex align-items-center" style="height:10%;width:100%;" onclick="loadMessages(${chat.chatId})">
        <img src="assets/img/profile_picture2.png" style="width:40px;height:40px;margin:0 10px 0 20px;">
        <label style="margin:0 10px;font-size:20px;">${person}</label>
   </div>
   <hr>`
    prependHtml("chats", chatHtml);
}

function send_chat(){

}

function send_message() {
    let currentChatId = currentChat;
    let message = document.getElementById("messageToSend").value;
    let username = getCookie("username");
    console.log(`sending message: ${message}`)
    document.getElementById("messageToSend").value = "";
    let date = formatDate(new Date());

    let messageObj = {
        chatId:currentChatId,
        sender: username,
        description: message,
        timestamp: date
    }
    chats.forEach(chat => {
        if(chat.chatId === currentChatId){
            chat.messages.push(message)
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

function prependHtml(id, html){
    document.getElementById(id).innerHTML = html + document.getElementById(id).innerHTML;
}

function appendHtml(id, html){
    document.getElementById(id).innerHTML = document.getElementById(id).innerHTML + html;
}

function formatDate(date) {
    let d = new Date()
    let ret = date.toISOString().slice(0, 10)
    ret += " "+ d.getHours()+":"+d.getMinutes()
    return ret
}

