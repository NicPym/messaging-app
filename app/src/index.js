import socketManager from './utils/socketManager';
import conversationService from './utils/conversationService';

function setInnerHTML(id, innerHTML) {
    document.getElementById(id).innerHTML = innerHTML;
}

document.getElementById("testButton").onclick = () => {
    socketManager.sendMessage(document.getElementById("messageInput").value);
}

fetch("http://localhost:8080/auth/getAccessToken")
    .then(res => { 
      if (res.ok)
        return res.json();
      else {
        throw new Error(res.statusText)
      }
    })
    .then(data => {
      if (data.token) {
        socketManager.connect(data.token);
        socketManager.registerEvent("new message", message => document.getElementById("messageDiv").innerHTML += `<h3>${message}</h3>`);
      }
      else {
        console.log("Please log in");
      }
    })
    .catch(function(error) {
      console.log(error);
    });