import { displayChat } from './ui';
import { formatDate } from './helpers';
import socketManager from './socketManager';

class ChatService {
    constructor() {
        this.chats = []; 
        this.currentChatId = null; // TODO:
    }

    messageReceived(message) {
        console.log(message);
        // this.chats.find(chat => chat.id === message.chatId).messages.append({
        //     sender: message.sender,
        //     description: message.description,
        //     timestamp: message.timestamp
        // });

        // this.chats.forEach(chat => {
        //     displayChat(chat);
        // });
    }

    sendMessage(description) {
        let date = formatDate(new Date());
        
        let messageObj = {
            chatId: this.currentChatId,
            description: description,
            timestamp: date
        }

        console.log(`sending message: ${description}`);
        socketManager.sendMessage(messageObj);

        // displayMessage(messageObj);
    }
}

export default new ChatService();