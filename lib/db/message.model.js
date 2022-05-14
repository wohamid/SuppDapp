import {v4 as uuidv4} from 'uuid';

export class MessageModel {
    constructor(createdBy, content, owner) {
        this.createdBy = createdBy;
        this.createdAt = Date.now();
        this.content = content;
        this.owner = owner;
        this.messageId = uuidv4();

        this.from = '';
        this.ticketId = '';
        this.ticketTitle = '';
    }
}