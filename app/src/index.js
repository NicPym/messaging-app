import socketManager from './utils/socketManager';
import conversationService from './utils/conversationService';

function setInnerHTML(id, innerHTML) {
    document.getElementById(id).innerHTML = innerHTML;
}

socketManager.connect();
socketManager.registerEvent("new message", message => document.getElementById("messageDiv").innerHTML += `<h3>${message}</h3>`);

document.getElementById("testButton").onclick = () => {
    socketManager.sendMessage(document.getElementById("messageInput").value);
}