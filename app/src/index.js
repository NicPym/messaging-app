import socketManager from './utils/socketManager';
import chatService from './utils/chatService';
import { setInnerHtml, prependHtml, setOnClick, getCookie, deleteAllCookies } from './utils/helpers';
import { addSmiley } from './utils/ui';

async function init() {
    const token = getCookie("token");

    if (token) {
        socketManager.connect(token);
        socketManager.registerEvent("new message", message => chatService.messageReceived(message));
        setInnerHtml("personTo", `<div class="d-flex flex-fill" style="width:0;"></div><label style="margin:0 30px;font-size:20px" id="loginBtn">Logout</label></div>`);
        setOnClick("loginBtn", logout);
        setOnClick("emojiButton", addSmiley);
        setOnClick("sendMessageButton", sendMessage);
    }
    else {
        prependHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Login to see chats and messsages!</label>`);
    }
}

function logout() { 
    deleteAllCookies();
    document.location.href = "/";
}

function sendMessage() {
    chatService.sendMessage(document.getElementById("messageToSend").value);
    document.getElementById("messageToSend").value = "";
}

await init();