import {
  displayConversation,
  loadConversations,
  invalidEmail,
  clearSearchInput,
} from "./ui";
import { formatDate, logout } from "./helpers";
import socketManager from "./socketManager";
import getToken from "./token";

class ConversationService {
  constructor() {
    this.conversations = [];
    this.currentConversationId = null; // TODO:
  }

  clearConversations() {
    this.conversations = [];
  }

  loadConversations() {
    fetch("/conversations/getConversations", {
      headers: new Headers({
        Authorization: "Bearer " + getToken(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // this.conversations = data;
        console.log(data);
        // loadConversations(this.conversations);
      })
      .catch((err) => console.log(err));
  }

  createConversation(recipientEmail) {
    fetch(`/conversations/createConversation/${recipientEmail}`, {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + getToken(),
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error(res.status);
      })
      .then((body) => {
        console.log(body);
        this.conversations.push(body.data);
        clearSearchInput();
      })
      .catch((err) => {
        console.log(err);
        invalidEmail();
      });
  }

  messageReceived(message) {
    this.conversations
      .find((conversation) => conversation.id === message.conversationId)
      .messages.push({
        received: message.received,
        body: message.body,
        timestamp: message.timestamp,
      });

    this.conversations.forEach((conversation) => {
      displayConversation(conversation);
    });
  }

  sendMessage(body) {
    let date = formatDate(new Date());

    let messageObj = {
      conversationId: this.currentConversationId,
      body: body,
      timestamp: date,
    };

    console.log(`sending message: ${body}`);
    socketManager.sendMessage(messageObj);

    // displayMessage(messageObj);
  }
}

export default new ConversationService();
