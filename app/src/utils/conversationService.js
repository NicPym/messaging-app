import { displayConversation, loadConversations } from "./ui";
import { formatDate, deleteAllCookies } from "./helpers";
import socketManager from "./socketManager";

class ConversationService {
  constructor() {
    this.conversations = null;
    this.currentConversationId = null; // TODO:
  }

  clearConversations() {
    this.conversations = [];
  }

  loadConversations(token) {
    fetch("http://localhost:8080/chats/conversations", {
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.conversations = data;
        loadConversations(this.conversations);
      })
      .catch((err) => {
        console.log(err);
        deleteAllCookies();
        document.location.href = "/";
      });
  }

  messageReceived(message) {
    this.conversations
      .find((conversation) => conversation.id === message.conversationId)
      .messages.append({
        sender: message.sender,
        description: message.description,
        timestamp: message.timestamp,
      });

    this.conversations.forEach((conversation) => {
      displayConversation(conversation);
    });
  }

  sendMessage(description) {
    let date = formatDate(new Date());

    let messageObj = {
      conversationId: this.currentConversationId,
      description: description,
      timestamp: date,
    };

    console.log(`sending message: ${description}`);
    socketManager.sendMessage(messageObj);

    // displayMessage(messageObj);
  }
}

export default new ConversationService();
