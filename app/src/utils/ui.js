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
    setOnClick(id, () => {
        conversationService.selectConversation(conversation.conversationId);
        hideNotification(conversation.conversationId);
      }
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
            <fill></fill>
            <p id="${id}-notification" class="notification-icon" hidden></p>
        </li>`;
}

export function showNotification(id) {
  let icon = document.getElementById(`conversation-${id}-notification`);
  icon.hidden = false;
}

export function hideNotification(id) {
  let icon = document.getElementById(`conversation-${id}-notification`);
  icon.hidden = true;
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

export function getHeaderWithUsernameHtml(username) {
  return `
        <img src="assets/img/profile_picture.png" class="active-profile-pic" alt="Profile Picture">
        <label class="active-profile-name">${username}</label>`;
}

export function getMessageReceivedHtml(body, timestamp) {
  return `
        <li class="flex-column">
            <message class="flex-row flex-grow align-items-end align-content-start">
                <card class="flex-column message-received-card">
                    <block class="flex-row message-body-container">
                        <p class="message-body">${body}</p>
                    </block>
                    <block class="flex-row justify-content-end align-items-start message-timestamp-container">
                        <p class="message-timestamp">${timestamp}</p>
                    </block>
                </card>
            </message>
        </li>`;
}

export function getMessageSentHtml(body, timestamp) {
  return `
        <li class="flex-column">
            <message class="flex-row justify-content-end align-items-end">
                <card class="flex-column message-sent-card">
                    <block class="flex-row message-body-container">
                        <p class="message-body">${body}</p>
                    </block>
                    <block class="flex-row justify-content-end align-items-start message-timestamp-container">
                        <p class="message-timestamp">${timestamp}</p>
                    </block>
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
    String.fromCodePoint("0X1F600"); // TODO: may case problems with SQL
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
