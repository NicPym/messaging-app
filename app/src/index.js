import socketManager from "./utils/socketManager";
import conversationService from "./utils/conversationService";
import {
  setInnerHtml,
  setOnClick,
  getCookie,
  login,
  logout
} from "./utils/helpers";
import {
  addSmiley,
  getHeaderWithoutUserHtml,
  loadConversations,
} from "./utils/ui";

async function init() {
  const token = getCookie("token");

  if (token) {
    setInnerHtml(
      "personTo",
      getHeaderWithoutUserHtml(
        "Select a Conversation to see the messages!"
      )
    );
    setInnerHtml("loginBtn", "Logout");
    setOnClick("loginBtn", logout);
    setOnClick("emojiButton", addSmiley);
    setOnClick("sendMessageButton", sendMessage);
    
    socketManager.connect(token);
    socketManager.registerEvent("new message", (message) =>
      conversationService.messageReceived(message)
    );
    conversationService.loadConversations(token);
  } else {
    setInnerHtml(
      "personTo",
      getHeaderWithoutUserHtml(
        "Login to see conversations and messages!"
      )
    );
    setInnerHtml("loginBtn", "Login");
    setOnClick("loginBtn", login);
  }
}

function sendMessage() {
  conversationService.sendMessage(
    document.getElementById("messageToSend").value
  );
  document.getElementById("messageToSend").value = "";
}

await init();
