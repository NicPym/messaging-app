import socketManager from './utils/socketManager';
import converationService from './utils/converationService';

function setInnerHTML(id, innerHTML) {
    document.getElementById(id).innerHTML = innerHTML;
}

socketManager.connect();
socketManager.registerEvent("new message", message => setInnerHTML('messageText', message));

document.getElementById("testButton").onclick = () => {
    socketManager.sendMessage(document.getElementById("messageInput").value);
}