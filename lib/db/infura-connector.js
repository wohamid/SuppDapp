import https from 'https'
import { create } from 'ipfs-http-client'

const projectId = '28yXn4CqLHJm7tiL8NqbLWh1ziH';
const projectSecret = 'a7d5f0b0c58d7b9dadb0f693b577fd9f';

const optionsRead = {
    host: 'ipfs.infura.io',
    port: 5001,
    path: '/api/v0/pin/ls',
    method: 'POST',
    auth: projectId + ':' + projectSecret,
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

export default async function upload() {
    // let temp_opt = {...options};
    // temp_opt.file = {'id': 0, 'content': 'test'}

    const fileDetails = {
        path: 'test/hello.json',
        content: 'Test content here'
    };

    const optionsUpload = {
        wrapWithDirectory: true
    };

    // Added here?
    const added = await client.add(fileDetails, optionsUpload);
    // const all = await client.ls('');


}

export default async function listContents() {
    let req = https.request(optionsRead, (res) => {
        let body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            console.log(body);
        });
    });

    req.end();

}