import socketManager from "./utils/socketManager";
import conversationService from "./utils/conversationService";
import {
  setInnerHtml,
  setOnClick,
  login,
  logout,
  getToken,
} from "./utils/helpers";
import { 
  getHeaderWithoutUserHtml,
  enableSearchBar,
} from "./utils/ui";

const token = getToken();

if (token) {
  setInnerHtml(
    "personTo",
    getHeaderWithoutUserHtml("Select a Conversation to see the messages!")
  );
  setInnerHtml("loginBtn", "Logout");
  setOnClick("loginBtn", logout);
  enableSearchBar();

  socketManager.connect();
  socketManager.registerEvent("new message", (message) =>
    conversationService.messageReceived(message)
  );
  socketManager.registerEvent("new conversation", (conversation) => conversationService.newConversation(conversation));
  conversationService.loadConversations();
} else {
  setInnerHtml(
    "personTo",
    getHeaderWithoutUserHtml("Login to see conversations and messages!")
  );
  setInnerHtml("loginBtn", "Login");
  setOnClick("loginBtn", login);
}
