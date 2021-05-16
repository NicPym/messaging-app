import socketManager from "./utils/socketManager";
import conversationService from "./utils/conversationService";
import {
  setInnerHtml,
  setOnClick,
  login,
  logout,
} from "./utils/helpers";
import { getHeaderWithoutUserHtml } from "./utils/ui";
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
    setOnClick("addConversationButton", () =>
      conversationService.createConversation(
        document.getElementById("searchOrCreateConversationInput").value
      )
    );

    socketManager.connect();
    socketManager.registerEvent("new message", (message) =>
      conversationService.messageReceived(message)
    );
    socketManager.registerEvent("new conversation", (message) => conversationService.newConversation(message));
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

init();
