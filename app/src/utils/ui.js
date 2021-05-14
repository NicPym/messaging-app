import { getCookie, setCookie, deleteCookie, appendHtml, setOnClick, setInnerHtml, getInnerHtml} from './helpers';
import conversationService from './conversationService';

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
    conversationService.conversations.push(conversation);
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
    conversationService.conversations.push(conversation);

    setInnerHtml("conversations", "");
    let username = getCookie("username");
    conversationService.conversations.forEach(conversation => {
        displayConversation(conversation);
    });
    // have to set callback afterwards else appendHtml erases them
    conversationService.conversations.forEach(conversation => {
        let id = `conversation-${conversation.conversationId}`
        setOnClick(id, () => loadMessages(conversation.conversationId));
    });
}

export function displayConversation(conversation) {
    let username = getCookie("username");
    let person = username === conversation.user1 ? conversation.user2 : conversation.user1;
    let id = `conversation-${conversation.conversationId}`;
    appendHtml("conversations", getConversationHtml(id, person));
}

function getConversationHtml(id, name) {
    return `
        <li id="${id}" class="flex-row align-items-center conversation-container">
            <img src="assets/img/profile_picture2.png" class="conversation-profile-pic" alt="Profile Picture">
            <label class="conversation-profile-name">${name}</label>
        </li>`;
}

function loadMessages(conversationId) {
    console.log(`Loading Messages with conversationId: ${conversationId}`)
    let messageArr = [];
    let personTo = ""
    let username = getCookie("username");
    conversationService.conversations.forEach(conversation => {
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
        <fill></fill>
        <button id="loginBtn" class="login-button"">${login}</button>`;
}

function getHeaderWithUsername(username, login){
    return `
        <img src="assets/img/profile_picture.png" class="active-profile-pic" alt="Profile Picture">
        <label class="active-profile-name">${username}</label>
        <fill></fill>
        <button id="loginBtn" class="login-button">${login}</button>`;
}

function getMessageReceivedHtml(body, timestamp) {
    return `
        <li class="flex-column">
            <message class="flex-row flex-grow align-items-end align-content-start">
                <card class="flex-column message-received-card">
                    <content class="flex-row message-body-container">
                        <p class="message-body">${body}</p>
                    </content>
                    <timestamp class="flex-row justify-content-end align-items-start message-timestamp-container">
                        <p class="message-timestamp">${timestamp}</p>
                    </timestamp>
                </card>
            </message>
        </li>`;
}

function getMessageSentHtml(body, timestamp) {
    return `
        <li class="flex-column">
            <message class="flex-row justify-content-end align-items-end">
                <card class="flex-column message-sent-card">
                    <content class="flex-row message-body-container">
                        <p class="message-body">${body}</p>
                    </content>
                    <timestamp class="flex-row justify-content-end align-items-start message-timestamp-container">
                        <p class="message-timestamp">${timestamp}</p>
                    </timestamp>
                </card>
            </message>
        </li>`;
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

export function addSmiley() {
    document.getElementById("messageToSend").value +=  String.fromCodePoint("0X1F600");
}

function clearMessages() {
    // TODO: where are the messages?
    setInnerHtml("messages", "")
}

function clearConversations() {
    conversationService.clearConversations();
    setInnerHtml("conversations", "")
}