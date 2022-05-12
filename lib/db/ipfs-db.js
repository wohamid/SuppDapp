import * as IPFS from 'ipfs-core'
import OrbitDB from "orbit-db";

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

        this._init();
    }

    async _init () {
        this.orbitdb = await this.OrbitDB.createInstance(this.node);
        this.defaultOptions = {
            accessController: {
                write: [this.orbitdb.identity.id]
            }
        };
    }

    async stop() {
        this.Ipfs.st
    }
}

// module.exports.stuff = new SuppDappDB(Ipfs, OrbitDB)

export default function getDb(){
    return new SuppDappDB(IPFS, OrbitDB)
}
