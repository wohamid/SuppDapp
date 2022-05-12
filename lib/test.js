import getDb from './db/ipfs-db.js'
import { MessageModel } from './db/message.model.js';

const database = getDb();

await database.create();

console.log(database.messages.id);

const testMessage = new MessageModel('secondUser', 'second', 'testOwner');
const content = database.getAllMessages();
const id = await database.addMesage(testMessage);



console.log(content);
