import socketManager from './utils/socketManager';
import chatService from './utils/chatService';
import { setInnerHtml, prependHtml, setCookie, setOnClick } from './utils/helpers';
import { addSmiley } from './utils/ui';

async function init() {
    try {
        const response = await fetch("http://localhost:8080/auth/getAccessToken");
        const data = await response.json();
        
        if (data.token) {
            setCookie(data.token);
            socketManager.connect(data.token);
            socketManager.registerEvent("new message", message => chatService.messageReceived(message));
            setInnerHtml("personTo", `<div class="d-flex flex-fill" style="width:0;"></div><a style="margin:0 30px;font-size:20px;text-decoration:none;color:black" href="http://localhost:8080/auth/logout" id="loginBtn">Logout</a></div>`);
            setOnClick("emojiButton", addSmiley);
            setOnClick("sendMessageButton", sendMessage);
        }
        else {
            prependHtml("personTo", `<label style="margin:0 10px;font-size:20px;">Login to see chats and messsages!</label>`);
        }
    }
    catch (err) {
        console.log(err);
    }
}

function sendMessage() {
    chatService.sendMessage(document.getElementById("messageToSend").value);
    document.getElementById("messageToSend").value = "";
}

await init();