import {
  loadConversations,
  loadMessages,
  invalidEmail,
  validSearchOrEmail,
  displayMessage,
  setHeaderWithUserHtml,
  showNotification,
  setActiveProfilePicture,
} from "./ui";
import { formatDate, logout, getToken } from "./helpers";
import socketManager from "./socketManager";

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
    console.log("Create conversation", recipientEmail);
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
        validSearchOrEmail();
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
      .find(
        (conversation) => conversation.conversationId === message.conversationId
      )
      .messages.push(newMessage);

    loadConversations(this.conversations);

    if (message.conversationId == this.currentConversationId) {
      displayMessage(newMessage);
    } else {
      showNotification(message.conversationId);
    }
  }

  sendMessage(body) {
    let date = formatDate(new Date());

    let message = {
      conversationId: this.currentConversationId,
      body: body,
      timestamp: date,
    };

    console.log(`sending message: ${body}`);
    socketManager.sendMessage(message);

    this.conversations
      .find(
        (conversation) =>
          conversation.conversationId === this.currentConversationId
      )
      .messages.push(message);

    displayMessage(message);
  }

  newConversation(conversation) {
    this.conversations.push(conversation);
    loadConversations(this.conversations);
    showNotification(message.conversationId);
  }

  selectConversation(conversationId) {
    this.currentConversationId = conversationId;
    const conversation = this.conversations.find(
      (conversation) => conversation.conversationId === conversationId
    );
    setHeaderWithUserHtml(conversation.conversationWith);
    loadMessages(conversation.messages);
    setActiveProfilePicture(conversation);
  }

  filterConversations(filterValue) {
    loadConversations(this.conversations, filterValue);
  }
}

export default new ConversationService();
