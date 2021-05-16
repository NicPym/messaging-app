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
    console.log('Create conversation', recipientEmail);
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
    console.log(`Message received - ${message.body}`);

    const newMessage = {
      body: message.body,
      timestamp: message.timestamp,
      received: message.received,
    };

    this.conversations
      .find((conversation) => conversation.conversationId === message.conversationId)
      .messages.push(newMessage);

    loadConversations(this.conversations);

    if (message.conversationId == this.currentConversationId) {
      displayMessage(newMessage);
    }
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

  newConversation(conversation) {
    this.conversations.push(conversation);
    loadConversations(this.conversations);
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
