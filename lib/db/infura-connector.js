import https from 'https'
import { create } from 'ipfs-http-client'
import { MessageModel } from './message.model.js';
import { TicketModel } from './ticket.model.js';

const projectId = '28yXn4CqLHJm7tiL8NqbLWh1ziH';
const projectSecret = 'a7d5f0b0c58d7b9dadb0f693b577fd9f';

const optionsReadDirectory = {
    host: 'ipfs.infura.io',
    port: 5001,
    path: '/api/v0/pin/ls',
    method: 'POST',
    auth: projectId + ':' + projectSecret,
};


const dynamicOptions = (fileHash) => {
    return {
        host: 'ipfs.infura.io',
        port: 5001,
        path: `/api/v0/${fileHash}`,
        method: 'POST',
        auth: projectId + ':' + projectSecret
    }
};

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    path: '/api/v0/test',
    headers: {
        "Authorization": "Basic " + btoa(projectId + ":" + projectSecret)
    },
    protocol: 'https'
})

const clientipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    path: '/api/v0/test',
    headers: {
        "Authorization": "Basic " + btoa(projectId + ":" + projectSecret)
    },
    protocol: 'https'
})

const template = {
    owners: [{
        id: '',
        users: [{
            id: '',
            messages: [{
                content: '',
                createdAt: ''
            }]
        }]
    }]
}



/**
 * Do a request with options provided.
 *
 * @param {MessageModel} message
 * @return {String} a promise of request
 */
export default async function upload(message) {
    // let temp_opt = {...options};
    // temp_opt.file = {'id': 0, 'content': 'test'}
    if (!message || !message.createdBy || !message.content || !message.owner) {
        throw new Error('Message to save is empty');
    }

    const existingContent = await getDataKeyFromInfura();

    let contentToUpload;

    if (!existingContent) {
        contentToUpload = {
            owners: [{
                id: message.owner,
                users: {
                    id: message.createdBy,
                    message: [{
                        content: message.content,
                        createdAt: Date.now()
                    }]
                }
            }, {
                id: 'test',
                users: {
                    id: 'innerTest',
                    message: [{
                        content: 'much',
                        createdAt: Date.now()
                    }]
                }
            }]
        }
    }

    // const fileDetails = {
    //     path: 'initial/mockdb.json',
    //     content: JSON.stringify(contentToUpload)
    // };

    // const optionsUpload = {
    //     wrapWithDirectory: true
    // };

    const nodeKey = 'QmSTkR1kkqMuGEeBS49dxVJjgHRMH6cUYa7D3tcHDQ3ea3';

    const suburl = `pin/add?arg=${nodeKey}`;
    const res = await doRequest(dynamicOptions(suburl));

    // Added here?
    //const added = await client.add(JSON.stringify(contentToUpload));

    return res;
    // const all = await client.ls('');
}

export async function readWhatever() {
    const nodeKey = 'QmSTkR1kkqMuGEeBS49dxVJjgHRMH6cUYa7D3tcHDQ3ea3';
    const res = await readWholeFakeDb(nodeKey);
    const a = 5;

}

export async function readWholeFakeDb() {
    const nodeKey = await getDataKeyFromInfura();

    const suburl = `get?arg=${nodeKey}`;
    const res = await doRequest(dynamicOptions(suburl));

    const jsonstr = res.split('{').slice(1).join('{');

    const lastIndex = jsonstr.lastIndexOf('}');
    const result = jsonstr.substring(0, lastIndex);
    const parsable = `{${result}}`

    const json = JSON.parse(parsable);
    return json;
}

// TODO: create owner
// export async function 

/**
 * Do a request with options provided.
 * @param {String} nodeKey
 * @param {MessageModel} message
 * @return {String} a promise of request
 */
export async function updateTicket(nodeKey, message) {
    const db = await readWholeFakeDb(nodeKey);

    const ownerToEdit = db.find(m => m.id === message.owner);

    if (ownerToEdit) {
        const ticketToEdit = ownerToEdit.tickets.find(t => t.id === message.ticketId);

        if (!ticketToEdit) {
            if (!ownerToEdit.tickets) {
                ownerToEdit.tickets = [];
            }

            const ticket = new TicketModel(message.ticketId, message.ticketTitle);
            ticket.messages.push(message);

            ownerToEdit.tickets.push(ticket)
        } else {
            ticketToEdit.messages.push(message);
        }


    } else {
        // Todo: soft error or add owner?
        throw new Error('No such owner exists');
    }

}

export async function testRemove() {
    const nodeKey = await getDataKeyFromInfura();
    if (nodeKey) {
        const isRemoved = await removeDb(nodeKey);
    }

    const newKey = await getDataKeyFromInfura();
}

async function removeDb(nodeKey) {
    const suburl = `pin/rm?arg=${nodeKey}`;
    const res = await doRequest(dynamicOptions(suburl));

    // TODO: check status code
    return true;

}

async function getDataKeyFromInfura() {
    const suburl = `dag/get?arg=''`;

    const res = await doRequest(dynamicOptions(suburl));
    
    const parsed = JSON.parse(res);

    for (let key in parsed.Keys) {
        if (parsed.Keys[key].Type === 'recursive') {
            return key;
        }
    }
}

/**
 * Do a request with options provided.
 *
 * @param {Object} options
 * @param {Object} data
 * @return {Promise} a promise of request
 */
 function doRequest(options, data) {
    return new Promise(function (resolve, reject) {
        let body = [];

        const req = https.request(options, res => {
          res.on('data', chunk => body.push(chunk));
          res.on('end', () => {
            const data = Buffer.concat(body).toString();
            resolve(data);
          });
        });
        req.on('error', e => {
          // console.log(`ERROR httpsGet: ${e}`);
          reject(e);
        });
        req.end();
    });
  }