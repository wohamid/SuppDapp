export class MessageModel {
    constructor(createdBy, content, owner, messageNumber) {
        this.createdBy = createdBy;
        this.createdAt = Date.now();
        this.content = content;
        this.owner = owner;
        this.messageId = messageNumber;
    }
}