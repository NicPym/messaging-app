import {
  displayConversation,
  loadConversations,
  loadMessages,
  invalidEmail,
  clearSearchInput,
  displayMessage,
  setHeaderWithUserHtml,
} from "./ui";
import { formatDate, logout } from "./helpers";
import socketManager from "./socketManager";
import getToken from "./token";

class ConversationService {
  constructor() {
    this.conversations = [];
    this.currentConversationId = null;
  }

  clearConversations() {
    this.conversations = [];
    this.currentConversationId = null;
  }

  loadConversations() {
    fetch("/conversations/getConversations", {
      headers: new Headers({
        Authorization: "Bearer " + getToken(),
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        this.conversations = body.data;
        loadConversations(this.conversations);
      })
      .catch((err) => {
        console.log(err);
        logout();
      });
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
        loadConversations(this.conversations);
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

    let messsage = {
      conversationId: this.currentConversationId,
      body: body,
      timestamp: date,
    };

    console.log(`sending message: ${body}`);
    socketManager.sendMessage(messsage);

    this.conversations
      .find(
        (conversation) =>
          conversation.conversationId === this.currentConversationId
      )
      .messages.push(messsage);

    displayMessage(messsage);
  }

  selectConversation(conversationId) {
    this.currentConversationId = conversationId;
    const conversation = this.conversations.find(
      (conversation) => conversation.conversationId === conversationId
    );
    setHeaderWithUserHtml(conversation.conversationWith);
    loadMessages(conversation.messages);
  }
}

export default new ConversationService();
