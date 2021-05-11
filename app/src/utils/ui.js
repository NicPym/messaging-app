import { getCookie, appendHtml } from './helpers';

export function displayMessage(message) {
    let messageHtml = ""
    let username = getCookie("username");
    if (message.sender !== username) {
        messageHtml += `
            <div class="d-flex flex-column" style="width:100%;">
                <div class="d-flex flex-row flex-grow-1 align-items-end align-content-start" style="width:100%;">
                    <div class="card d-flex flex-column" style="margin:20px;max-width:50%;box-shadow:1px 1px 5px grey;">
                        <div class="d-flex flex-row" style="padding:10px;width:100%;height:90%;">
                            <p style="margin:0px;">${message.description}</p>
                        </div>
                        <div class="d-flex flex-row justify-content-end align-items-start" style="width:100%;height:10%;padding:5px;">
                            <p style="font-size:12px;margin:2px 10px;">${message.timestamp}</p>
                        </div>
                    </div>
                </div>
            </div>`
    } else {
        messageHtml += `
            <div class="d-flex flex-column" style="width:100%;">
                <div class="d-flex flex-row justify-content-end align-items-end" style="width:100%;">
                    <div class="card d-flex flex-column" style="margin:20px;max-width:50%;background-color:rgb(220,248,198);box-shadow:1px 1px 5px grey;">
                        <div class="d-flex flex-row" style="padding:10px;width:100%;height:90%;">
                            <p style="margin:0px;">${message.description}</p>
                        </div>
                        <div class="d-flex flex-row justify-content-end align-items-start" style="width:100%;height:10%;padding:5px;">
                            <p style="font-size:12px;margin:2px 10px;">${message.timestamp}</p>
                        </div>
                    </div>
                </div>
            </div>`
    }
    appendHtml("messages", messageHtml)
}

export function displayChat(chat) {
    let username = getCookie("username")
    let person = username === chat.user1 ? chat.user2 : chat.user1;
    let chatHtml = `
        <div class="d-flex align-items-center" style="height:10%;width:100%;" onclick="loadMessages(${chat.chatId})">
            <img src="assets/img/profile_picture2.png" style="width:40px;height:40px;margin:0 10px 0 20px;">
            <label style="margin:0 10px;font-size:20px;">${person}</label>
       </div>
    <hr>`
    appendHtml("chats", chatHtml);
}

export function addSmiley() {
    document.getElementById("messageToSend").value +=  String.fromCodePoint("0X1F600");
}