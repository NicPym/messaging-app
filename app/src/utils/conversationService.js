import { displayConversation } from './ui';
import { formatDate } from './helpers';
import socketManager from './socketManager';

class ConversationService {
    constructor() {
        this.conversations = []; 
        this.currentConversationId = null; // TODO:
    }

    clearConversations() {
        this.conversations = [];
    }

    messageReceived(message) {
        this.conversations.find(conversation => conversation.id === message.conversationId).messages.append({
            sender: message.sender,
            description: message.description,
            timestamp: message.timestamp
        });

        this.conversations.forEach(conversation => {
            displayConversation(conversation);
        });
    }

    sendMessage(description) {
        let date = formatDate(new Date());
        
        let messageObj = {
            conversationId: this.currentConversationId,
            description: description,
            timestamp: date
        }

        console.log(`sending message: ${description}`);
        socketManager.sendMessage(messageObj);

        // displayMessage(messageObj);
    }
}

export default new ConversationService();