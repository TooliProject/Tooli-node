module.exports = class Chat {
    constructor(id, senderId, senderName, message, timestamp){
        this.id = id;
        this.senderId = senderId;
        this.senderName = senderName; 
        this.message = message;
        this.timestamp = timestamp;
    }
}; 