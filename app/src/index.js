import socketManager from "./utils/socketManager";
import conversationService from "./utils/conversationService";
import {
  setInnerHtml,
  setOnClick,
  getCookie,
  login,
  logout,
} from "./utils/helpers";
import { addSmiley, getHeaderWithoutUserHtml } from "./utils/ui";
import getToken from "./utils/token";

function init() {
  const token = getToken();

  if (token) {
    setInnerHtml(
      "personTo",
      getHeaderWithoutUserHtml("Select a Conversation to see the messages!")
    );
    setInnerHtml("loginBtn", "Logout");
    setOnClick("loginBtn", logout);
    setOnClick("emojiButton", addSmiley);
    setOnClick("sendMessageButton", sendMessage);
    setOnClick("addConversationButton", () =>
      conversationService.createConversation(
        document.getElementById("searchOrCreateConversationInput").value
      )
    );

    socketManager.connect();
    socketManager.registerEvent("new message", (message) =>
      conversationService.messageReceived(message)
    );
    conversationService.loadConversations();
  } else {
    setInnerHtml(
      "personTo",
      getHeaderWithoutUserHtml("Login to see conversations and messages!")
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

init();
