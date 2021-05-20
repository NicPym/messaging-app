import {
  displayActiveConversations,
  sortConversations,
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
        console.log(this.conversations);
        displayActiveConversations(this.conversations);
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
        displayActiveConversations(this.conversations);
      })
      .catch((err) => {
        console.log(err);
        invalidEmail();
        displayActiveConversations(this.conversations);
      });
  }

  messageReceived(message) {
    console.log(`Message received - ${message.body}`);

    const newMessage = {
      body: message.body,
      timestamp: message.timestamp,
      received: message.received,
    };

    const conversation = this.conversations.find(
      (conversation) => conversation.conversationId === message.conversationId
    );
    conversation.messages.push(newMessage);

    sortConversations(this.conversations);

    if (message.conversationId == this.currentConversationId) {
      displayMessage(newMessage);
      this.setAllMessageToReadInConversation(message.conversationId);
    } else {
      conversation.unreadMessages++;
      showNotification(message.conversationId, conversation.unreadMessages);
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
    displayActiveConversations(this.conversations);
  }

  selectConversation(conversationId) {
    this.currentConversationId = conversationId;
    const conversation = this.conversations.find(
      (conversation) => conversation.conversationId === conversationId
    );
    setHeaderWithUserHtml(conversation.conversationWith);
    loadMessages(conversation.messages);
    setActiveProfilePicture(conversation);

    this.setAllMessageToReadInConversation(conversationId);
  }

  filterConversations(filterValue) {
    displayActiveConversations(this.conversations, filterValue);
  }

  setAllMessageToReadInConversation(conversationId) {
    fetch(`/conversations/readAllMessages/${conversationId}`, {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + getToken(),
      }),
    })
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });

    const conversation = this.conversations.find(
      (conversation) => conversation.conversationId === conversationId
    );
    if (conversation) conversation.unreadMessages = 0;
  }
}

export default new ConversationService();
