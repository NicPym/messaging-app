import { displayChat } from './ui';
import socketManager from './socketManager';

class ChatService {
    constructor() {
        this.chats = []; 
        this.currentChatId = null; // TODO:
    }

    messageReceived(message, chatId) {
        this.chats.find(chat => chat.id === chatId).messages.append({
            sender: message.sender,
            description: message.description,
            timestamp: message.timestamp
        });

        this.chats.forEach(chat => {
            displayChat(chat);
        });
    }

    sendMessage(description) {
        let message = document.getElementById("messageToSend").value;
        let date = formatDate(new Date());
        
        let messageObj = {
            chatId: this.currentChatId,
            description: description,
            timestamp: date
        }

        console.log(`sending message: ${message}`);
        socketManager.sendMessage(messageObj);

        displayMessage(messageObj);
    }
}

export default new ChatService();