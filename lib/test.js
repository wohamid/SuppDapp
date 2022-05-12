import getDb from './db/ipfs-db.js'

const a = getDb();

await a.create();

console.log(a);