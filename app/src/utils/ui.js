import { appendHtml, setInnerHtml, getInnerHtml } from "./helpers";
import conversationService from "./conversationService";
import { setOnClick } from "./helpers";

export function loadConversations(conversations) {
  console.log("Loading Conversations");

  setInnerHtml("conversations", "");
  conversations.forEach((conversation) => {
    displayConversation(conversation);
  });

  // have to set callback afterwards else appendHtml erases them
  conversations.forEach((conversation) => {
    let id = `conversation-${conversation.conversationId}`;
    setOnClick(id, () =>
      conversationService.selectConversation(conversation.conversationId)
    );
  });
}

export function displayConversation(conversation) {
  let id = `conversation-${conversation.conversationId}`;
  appendHtml(
    "conversations",
    getConversationHtml(id, conversation.conversationWith)
  );
}

export function getConversationHtml(id, name) {
  return `
        <li id="${id}" class="flex-row align-items-center conversation-container">
            <img src="assets/img/profile_picture2.png" class="conversation-profile-pic" alt="Profile Picture">
            <label class="conversation-profile-name">${name}</label>
        </li>`;
}

export function loadMessages(messages) {
  setInnerHtml("messages", "");

  messages.forEach((message) => {
    displayMessage(message);
  });
}

export function setHeaderWithUserHtml(personTo) {
  setInnerHtml("personTo", getHeaderWithUsername(personTo));
}

export function getHeaderWithoutUserHtml(message) {
  return `<label class="active-profile-name">${message}</label>`;
}

export function getHeaderWithUsername(username) {
  return `
        <img src="assets/img/profile_picture.png" class="active-profile-pic" alt="Profile Picture">
        <label class="active-profile-name">${username}</label>`;
}

export function getMessageReceivedHtml(body, timestamp) {
  return `
        <li class="flex-column">
            <message class="flex-row flex-grow align-items-end align-content-start">
                <card class="flex-column message-received-card">
                    <content class="flex-row message-body-container">
                        <p class="message-body">${body}</p>
                    </content>
                    <timestamp class="flex-row justify-content-end align-items-start message-timestamp-container">
                        <p class="message-timestamp">${timestamp}</p>
                    </timestamp>
                </card>
            </message>
        </li>`;
}

export function getMessageSentHtml(body, timestamp) {
  return `
        <li class="flex-column">
            <message class="flex-row justify-content-end align-items-end">
                <card class="flex-column message-sent-card">
                    <content class="flex-row message-body-container">
                        <p class="message-body">${body}</p>
                    </content>
                    <timestamp class="flex-row justify-content-end align-items-start message-timestamp-container">
                        <p class="message-timestamp">${timestamp}</p>
                    </timestamp>
                </card>
            </message>
        </li>`;
}

export function displayMessage(message) {
  let messageHtml = "";

  if (message.received) {
    messageHtml += getMessageReceivedHtml(message.body, message.timestamp);
  } else {
    messageHtml += getMessageSentHtml(message.body, message.timestamp);
  }

  appendHtml("messages", messageHtml);
  scrollToBottomOfMessages();
}

export function addSmiley() {
  document.getElementById("messageToSend").value +=
    String.fromCodePoint("0X1F600");
}

export function clearMessages() {
  // TODO: where are the messages?
  setInnerHtml("messages", "");
}

export function clearConversations() {
  conversationService.clearConversations();
  setInnerHtml("conversations", "");
}

export function scrollToBottomOfMessages() {
  let element = document.getElementById("messages");
  element.scrollTop = element.scrollHeight;
}

export function invalidEmail() {
  document.getElementById("searchOrCreateConversationInput").value =
    "Not a valid email address";
}

export function clearSearchInput() {
  document.getElementById("searchOrCreateConversationInput").value = "";
}
