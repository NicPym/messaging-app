import { getCookie, setCookie, deleteCookie, appendHtml, setOnClick, setInnerHtml, getInnerHtml} from './helpers';
let conversations = [];
let messages = [];
let currentConversation = null;

export function toggleLogin() {
    console.log("Toggling login");
    if (getInnerHtml("loginBtn") === "Login") {
        googleAuth()
        setInnerHtml("personTo", getHeaderWithoutUserHtml("Select a Conversation to see the messages!", "Logout"));
        loadConversations();
    } else {
        deleteCookie("token");
        deleteCookie("username");
        setInnerHtml("personTo", getHeaderWithoutUserHtml("Login to see conversations and messages!", "Login"));
        clearConversations();
        clearMessages();
    }
    setOnClick("loginBtn", toggleLogin);
}

function googleAuth() {
    // TODO: google auth here set token and username
    //href="http://localhost:8080/auth/login"
    let token = "1234"
    let username = "Duncan"
    setCookie("token", token);
    setCookie("username", username);
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
    conversations.forEach(c => {
        displayConversation(c);
    });

}

function displayConversation(conversation) {
    let username = getCookie("username")
    let person = username === conversation.user1 ? conversation.user2 : conversation.user1;
    let id = `conversation-${conversation.conversationId}`
    //let id = conversation.conversationId;
    appendHtml("conversations", getConversationHtml(id, person));
    setOnClick(id, () => loadMessages(conversation.conversationId));
}

function getConversationHtml(id, name) {
    return `
        <div class="flex-row align-items-center conversation-container" id="${id}">
            <img src="assets/img/profile_picture2.png" class="conversation-profile-pic">
            <label class="conversation-profile-name">${name}</label>
        </div>
        <hr>`;
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

    if(personTo === ""){
        setInnerHtml("personTo", getHeaderWithoutUserHtml("Select a Conversation to see the messages!", login));
    }else{
        setInnerHtml("personTo",getHeaderWithUsername(personTo, login));
    }

    setInnerHtml("messages","");

    messageArr.forEach(message => {
        displayMessage(message)
    });
}


export function getHeaderWithoutUserHtml(message, login){
    return `
    <label class="active-profile-name">${message}</label>
    <div class="flex-fill"></div>
    <a id="loginBtn" class="login-button"">${login}</a>
    `;
}

function getHeaderWithUsername(username, login){
    return `
    <img src="assets/img/profile_picture.png" class="active-profile-pic">
    <label class="active-profile-name">${username}</label>
    <div class="flex-fill"></div>
    <a id="loginBtn" class="login-button" onclick="toggleLogin()">${login}</a> 
    `;
}


function getMessageReceivedHtml(body, timestamp) {
    return `
        <div class="flex-column">
            <div class="flex-row flex-grow align-items-end align-content-start">
                <div class="card flex-column message-received-card">
                    <div class="flex-row message-body-container">
                        <p class="message-body">${body}</p>
                    </div>
                    <div class="flex-row justify-content-end align-items-start message-timestamp-container">
                        <p class="message-timestamp">${timestamp}</p>
                    </div>
                </div>
            </div>
        </div>`;
}

function getMessageSentHtml(body, timestamp) {
    return `
        <div class="flex-column">
            <div class="flex-row justify-content-end align-items-end">
                <div class="card flex-column message-sent-card">
                    <div class="flex-row message-body-container">
                        <p class="message-body">${body}</p>
                    </div>
                    <div class="flex-row justify-content-end align-items-start message-timestamp-container">
                        <p class="message-timestamp">${timestamp}</p>
                    </div>
                </div>
            </div>
        </div>`;
}

export function displayMessage(message) {
    let messageHtml = ""
    let username = getCookie("username");
    if (message.sender !== username) {
        messageHtml += getMessageReceivedHtml(message.description, message.timestamp);

    } else {
        messageHtml += getMessageSentHtml(message.description, message.timestamp);
    }
    appendHtml("messages", messageHtml)
}

export function displayChat(chat) {
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

export function addSmiley() {
    document.getElementById("messageToSend").value +=  String.fromCodePoint("0X1F600");
}

function clearMessages() {
    messages = [];
    setInnerHtml("messages", "")
}

function clearConversations() {
    conversations = [];
    setInnerHtml("conversations", "")
}