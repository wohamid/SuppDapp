import getDb from './db/ipfs-db.js'
import { MessageModel } from './db/message.model.js';
import upload, { readWhatever } from "./db/infura-connector.js";

// const database = getDb();
//
// await database.create();
//
// console.log(database.messages.id);
//
// const testMessage = new MessageModel('secondUser', 'second', 'testOwner');
// const content = database.getAllMessages();
// const id = await database.addMesage(testMessage);
//
//
//
// console.log(content);

const a = 5;

// listContents();
const testUser = new MessageModel('testUser', 'firstContent', 'me');
// const test = '{"owners":[{"id":"me","users":{"id":"testUser","message":[{"content":"firstContent","createdAt":1652443104251}]}},{"id":"test","users":{"id":"innerTest","message":[{"content":"much","createdAt":1652443104252}]}}]}…'

// const testa = JSON.parse(test);

// await upload(testUser)

await readWhatever();


