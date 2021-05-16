import { appendHtml, setInnerHtml, getInnerHtml, imgLoad, getCookie} from "./helpers";
import conversationService from "./conversationService";
import { setOnClick } from "./helpers";

export function loadConversations(conversations) {
  console.log("Loading Conversations");

  // TODO: api call to server
  let conversation = {
    conversationId: 1,
    user1: "Duncan",
    user2: "Stuart",
    messages: [
      {
        conversationId: 1,
        sender: "Duncan",
        body: "Hi Stuart",
        timestamp: "2021-05-08 16:10",
      },
      {
        conversationId: 1,
        sender: "Stuart",
        body: "Sup Duncan :)",
        timestamp: "2021-05-08 16:15",
      },
    ],
  };
  conversationService.conversations.push(conversation);
  conversation = {
    conversationId: 2,
    user1: "Raymond",
    user2: "Duncan",
    messages: [
      {
        conversationId: 2,
        sender: "Raymond",
        body: "olo Duncan",
        timestamp: "2021-05-06 11:00",
      },
      {
        conversationId: 2,
        sender: "Duncan",
        body: "Booiiiiii",
        timestamp: "2021-05-07 07:10",
      },
    ],
  };
  conversationService.conversations.push(conversation);

  setInnerHtml("conversations", "");
  conversationService.conversations.forEach((conversation) => {
    displayConversation(conversation);
  });

  // have to set callback afterwards else appendHtml erases them
  conversationService.conversations.forEach((conversation) => {
    let id = `conversation-${conversation.conversationId}`;
    setOnClick(id, () => loadMessages(conversation.conversationId));
  });
}

export function displayConversation(conversation) {
  let username = "Duncan"; // TODO: un-Duncan the JS
  let person =
    username === conversation.user1 ? conversation.user2 : conversation.user1;
  let id = `conversation-${conversation.conversationId}`;
  appendHtml("conversations", getConversationHtml(id, person));
}

export function getConversationHtml(id, name) {
  return `
        <li id="${id}" class="flex-row align-items-center conversation-container">
            <img src="assets/img/profile_picture2.png" class="conversation-profile-pic" alt="Profile Picture">
            <label class="conversation-profile-name">${name}</label>
        </li>`;
}

export function loadMessages(conversationId) {
  console.log(`Loading Messages with conversationId: ${conversationId}`);
  let messageArr = [];
  let personTo = "";
  let username = "Duncan"; // TODO: un-Duncan the JS

  conversationService.conversations.forEach((conversation) => {
    if (conversation.conversationId === conversationId) {
      messageArr = conversation.messages;
      personTo =
        conversation.user1 === username
          ? conversation.user2
          : conversation.user1;
    }
  });

  if (personTo === "") {
    setInnerHtml(
      "personTo",
      getHeaderWithoutUserHtml("Select a Conversation to see the messages!")
    );
  } else {
    setInnerHtml("personTo", getHeaderWithUsername(personTo));
  }

  setInnerHtml("messages", "");

  messageArr.forEach((message) => {
    displayMessage(message);
  });
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
  let username = "Duncan"; // TODO: un-Duncan the JS
  if (message.sender !== username) {
    messageHtml += getMessageReceivedHtml(
      message.body,
      message.timestamp
    );
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

export function setProfilePic(){
  let userPhotoURL = getCookie("photo-url");
  let firstName = getCookie("firstName");
  imgLoad(userPhotoURL).then(function(response){
    let imageURL = window.URL.createObjectURL(response);
    let userPhoto = document.getElementById('user-photo');
    userPhoto.src = imageURL;
    userPhoto.alt = firstName;
    document.getElementById('user-photo-caption').innerHTML = firstName;
  }).catch(function(errorurl){
      console.log('Error loading ' + errorurl)
  })
}
export function scrollToBottomOfMessages(){
  let element = document.getElementById("messages");
  element.scrollTop = element.scrollHeight;
}
