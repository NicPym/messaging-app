import {
  appendHtml,
  setInnerHtml,
  setOnClick,
  setOnInput,
  sendMessage,
  imgLoad,
  formatDate,
} from "./helpers";
import conversationService from "./conversationService";

export function displayActiveConversations(conversations, filterValue) {
  if (filterValue) {
    conversations = conversations.filter(
      (element) =>
        element.conversationWith
          ?.toLowerCase()
          .indexOf(filterValue.toLowerCase()) != -1
    );
  }

  conversations.sort((a, b) => compareConversations(a, b));

  setInnerHtml("conversations", "");
  conversations.forEach((conversation) => {
    displayConversation(conversation);
    setConversationPicture(conversation);
    if (conversation.unreadMessages > 0) {
      showNotification(
        conversation.conversationId,
        conversation.unreadMessages
      );
    }
  });

  // have to set callback afterwards else appendHtml erases them
  conversations.forEach((conversation) => {
    let id = `conversation-${conversation.conversationId}`;
    setOnClick(id, () => {
      conversationService.selectConversation(conversation.conversationId);
      resetNotification(conversation.conversationId);
      enableSendMessageBar();
    });
  });
}

export function compareConversations(a, b) {
  // compare by time of last message sent
  if (a.messages.length == 0) return -1;
  if (b.messages.length == 0) return 1;

  const aLast = Date.parse(a.messages[a.messages.length - 1].timestamp);
  const bLast = Date.parse(b.messages[b.messages.length - 1].timestamp);

  return bLast - aLast;
}

export function sortConversations(conversations) {
  let ul = document.getElementById("conversations");
  let ul_new = ul.cloneNode(false);
  conversations.sort((a, b) => compareConversations(a, b));
  for (let i = 0; i < conversations.length; i++) {
    let id = `conversation-${conversations[i].conversationId}`;
    let node = document.getElementById(id);
    ul_new.appendChild(node);
    console.log(i);
  }
  ul.parentNode.replaceChild(ul_new, ul);
}

export function displayConversation(conversation) {
  appendHtml(
    "conversations",
    getConversationHtml(
      conversation.conversationId,
      conversation.conversationWith
    )
  );
}

export function getConversationHtml(id, name) {
  return `
        <li id="conversation-${id}" class="flex-row align-items-center conversation-container">
            <img id="conversation-${id}-picture" src="assets/img/profile_picture2.png" class="conversation-profile-pic" alt="Profile Picture">
            <label class="conversation-profile-name">${name}</label>
            <fill></fill>
            <ul id="conversation-${id}-notification" class="notification-icon" hidden> 
              <p id="conversation-${id}-notification-text" class="notification-text">0</p>
            </ul>
        </li>`;
}

export function showNotification(id, countUnreadMessages) {
  let icon = document.getElementById(`conversation-${id}-notification`);
  if (icon) {
    icon.hidden = false;
    let txt = document.getElementById(`conversation-${id}-notification-text`);
    txt.innerText = countUnreadMessages;
  }
}

export function resetNotification(id) {
  let icon = document.getElementById(`conversation-${id}-notification`);
  if (icon) {
    let txt = document.getElementById(`conversation-${id}-notification-text`);
    txt.innerText = "0";
    icon.hidden = true;
  }
}

export function loadMessages(messages) {
  setInnerHtml("messages", "");

  messages.forEach((message) => {
    displayMessage(message);
  });
}

export function setHeaderWithUserHtml(personTo) {
  setInnerHtml("personTo", getHeaderWithUsernameHtml(personTo));
}

export function getHeaderWithoutUserHtml(message) {
  return `<label class="active-profile-name">${message}</label>`;
}

export function getHeaderWithUsernameHtml(username) {
  return `
        <img id="active-profile-pic" src="assets/img/profile_picture.png" class="active-profile-pic" alt="Profile Picture">
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
                        <p class="message-timestamp">${formatDate(
                          timestamp
                        )}</p>
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
                        <p class="message-timestamp">${formatDate(
                          timestamp
                        )}</p>
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
  let input = document.getElementById("messageToSend");
  if (input) {
    input.value += ":)";
    // input.value += String.fromCodePoint("0X1F600"); // TODO: Smiley emoji causes problems with SQL
  }
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
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
}

export function invalidEmail() {
  let input = document.getElementById("searchOrCreateConversationInput");
  if (input) {
    input.value = "";
    input.placeholder = "Not a valid email address";
  }
}

export function validSearchOrEmail() {
  let input = document.getElementById("searchOrCreateConversationInput");
  if (input) {
    input.value = "";
    input.placeholder = "Search or start new conversation";
  }
}

export function enableSendMessageBar() {
  setInnerHtml(
    "sendMessageBar",
    `
    <p id="emojiButton" class="emoji-icon icon-box"></p>
    <input class="flex-fill" id="messageToSend" placeholder="Type your message here and press the plane icon to send" type="text">
    <p id="sendMessageButton" class="send-icon icon-box"></p>`
  );
  setOnClick("emojiButton", addSmiley);
  setOnClick("sendMessageButton", sendMessage);
  document
    .querySelector("#messageToSend")
    .addEventListener("keyup", (event) => {
      if (event.key !== "Enter") return;
      sendMessage();
      event.preventDefault();
    });
}

export function enableSearchBar() {
  setInnerHtml(
    "searchBar",
    `
    <p id="searchConversationsButton" class="search-icon icon-box"></p>
    <input class="flex-fill" id="searchOrCreateConversationInput" placeholder="Search or start new conversation" type="text">
    <p id="addConversationButton" class="plus-icon icon-box"></p>`
  );
  setOnClick("addConversationButton", () =>
    conversationService.createConversation(
      document.getElementById("searchOrCreateConversationInput").value
    )
  );
  setOnClick("searchConversationsButton", () =>
    conversationService.filterConversations(
      document.getElementById("searchOrCreateConversationInput").value
    )
  );
  setOnInput("searchOrCreateConversationInput", () => {
    conversationService.filterConversations(
      document.getElementById("searchOrCreateConversationInput").value
    );
    document.getElementById("searchOrCreateConversationInput").placeholder =
      "Search or start new conversation";
  });
}

export function setConversationPicture(conversation) {
  setProfilePicture(
    `conversation-${conversation.conversationId}-picture`,
    conversation.conversationWithProfilePicURL,
    conversation.conversationWith
  );
}

export function setProfilePicture(id, userProfilePictureURL, userName) {
  imgLoad(userProfilePictureURL)
    .then(function (response) {
      let imageURL = window.URL.createObjectURL(response);
      let userImage = document.getElementById(id);
      userImage.src = imageURL;
      userImage.alt = userName;
      userImage.hidden = false;
    })
    .catch(function (errorurl) {
      console.log("Error loading " + errorurl);
    });
}

export function setActiveProfilePicture(conversation) {
  // this image should already have been downloaded
  let id = `conversation-${conversation.conversationId}-picture`;
  let userImage = document.getElementById(id);
  let activeImage = document.getElementById("active-profile-pic");
  activeImage.src = userImage.src;
}
