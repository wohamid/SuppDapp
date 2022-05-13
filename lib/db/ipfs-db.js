import * as IPFS from 'ipfs-core'
import OrbitDB from "orbit-db";
import { MessageModel } from './message.model.js';
import {config} from "process";

/**
 * @param {import(IPFS)} IPFS
 * @param {import(OrbitDB)} OrbitDB
 */
class SuppDappDB {
    constructor (Ipfs, OrbitDB) {
        this.Ipfs = Ipfs;
        this.OrbitDB = OrbitDB;
    }

    async create() {
        this.node = await this.Ipfs.create({
            preload: { enabled: false },
            repo: './ipfs',
            EXPERIMENTAL: { pubsub: true },
            config: {
                Bootstrap: [],
                Addresses: { Swarm: [] }
            }
        });

        await this._init();
    }

    async _init () {
        this.orbitdb = await this.OrbitDB.createInstance(this.node);
        this.defaultOptions = {
            accessController: {
                write: [this.orbitdb.identity.id]
            }
        };

        const docStoreOptions = {
            ...this.defaultOptions
            // indexBy: 'messageId' // TODO: id?
        };

        this.messages = await this.orbitdb.docstore('messages', docStoreOptions);
        await this.messages.load();
    }

    /**
     * @param {import(MessageModel)} IPFS
     */
    async addMesage(createdBy, owner, content) {
        // TODO: figure out IDs - numbers or guid?
        // await this.messages.load();
        // const messageNumber = this.messages.
        const message = new MessageModel(createdBy, content, owner);
        const cid = await this.messages.put({...message});

        return cid;
    }

    getAllMessages() {
        return this.messages.get('');
    }

    getAllMessagesForOwner(owner) {
        return this.messages.query((message) => message.owner === owner);
    }

    getAllMessagesForUser(userId) {
        return this.messages.query((message) => message.createdBy === userId);
    }

    getMessageCount() {
        return this.messages.get('').length();
    }
}

let currentInstance = null;

export default async function getDb(){
    // console.log(this.currentInstance === null);

    console.log(`Current instance is: ` + currentInstance);
    if (currentInstance === null){
        console.log('in');
        currentInstance = new SuppDappDB(IPFS, OrbitDB);
        await currentInstance.create();
        console.log('Started new instance of OrbitDB');
    }

    return currentInstance;
}
