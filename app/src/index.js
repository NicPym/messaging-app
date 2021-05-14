import socketManager from "./utils/socketManager";
import conversationService from "./utils/conversationService";
import {
  setInnerHtml,
  setOnClick,
  getCookie,
  deleteAllCookies,
} from "./utils/helpers";
import {
  addSmiley,
  getHeaderWithoutUserHtml,
  loadConversations,
} from "./utils/ui";

async function init() {
  const token = getCookie("token");

  if (token) {
    socketManager.connect(token);
    socketManager.registerEvent("new message", (message) =>
      conversationService.messageReceived(message)
    );
    setInnerHtml(
      "personTo",
      getHeaderWithoutUserHtml(
        "Select a Conversation to see the messages!",
        "Logout"
      )
    );
    setOnClick("loginBtn", logout);
    setOnClick("emojiButton", addSmiley);
    setOnClick("sendMessageButton", sendMessage);
    loadConversations();
  } else {
    setInnerHtml(
      "personTo",
      getHeaderWithoutUserHtml(
        "Login to see conversations and messages!",
        "Login"
      )
    );
    setOnClick("loginBtn", login);
  }
}

function logout() {
  deleteAllCookies();
  document.location.href = "/";
}

function login() {
  console.log("hey");
  document.location.href = "/auth/login";
}

function sendMessage() {
  conversationService.sendMessage(
    document.getElementById("messageToSend").value
  );
  document.getElementById("messageToSend").value = "";
}

await init();
