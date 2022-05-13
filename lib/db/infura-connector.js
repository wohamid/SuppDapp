import https from 'https'
import { create } from 'ipfs-http-client'
import { MessageModel } from './message.model.js';

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

    const fileDetails = {
        path: 'initial/mockdb.json',
        content: JSON.stringify(contentToUpload)
    };

    const optionsUpload = {
        wrapWithDirectory: true
    };

    // Added here?
    const added = await client.add(fileDetails, optionsUpload);

    return added;
    // const all = await client.ls('');
}

export async function readWhatever() {
    const key = await getDataKeyFromInfura();

    const suburl = `get?arg=${key}`;

    const res = await doRequest(dynamicOptions(suburl));
    console.log(res);

    const firstclam = res.indexOf('{');

    const jsonstr = res.split('{').slice(1).join('{');
    console.log(jsonstr);

    const asdasd = '{' + jsonstr;
    console.log(asdasd);

    const lastIndex = jsonstr.lastIndexOf('}');
    const result = jsonstr.substring(0, lastIndex);
    const parsable = `{${result}}`


    const json = JSON.parse(parsable);
    const a = 1;
}

// export default async function listContents() {
//     // let req = https.request(optionsRead, (res) => {
//     //     let body = '';
//     //     res.on('data', function (chunk) {
//     //         body += chunk;
//     //     });
//     //     res.on('end', function () {
//     //         console.log(body);
//     //     });
//     // });

//     // req.end();
//     const res = await doRequest(optionsRead);

//     const jsonresponse = JSON.parse(res);

//     if (jsonresponse.Keys.lentgh === 0) {
//         return null;
//     } else if (jsonresponse.Keys.lentgh > 1) {
//         // delete existing 
//     }

//     console.log(res)
// }

async function getDataKeyFromInfura() {
    const res = await doRequest(optionsReadDirectory);
    
    const parsed = JSON.parse(res);

    for (let key in parsed.Keys) {
        if (parsed.Keys[key].Type === 'recursive') {
            return key;
        }
    }

    // return null;
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