export class MessageModel {
    constructor(from, text, createdAt) {
        this.from = from || '';
        this.text = text || '';
        this.createdAt = createdAt || Date.now();
    }
}