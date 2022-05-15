import Cookies from 'cookies'
import { decryptObj } from '../lib/crypt.js';
import { allowCors } from '../lib/corsHelper.js';
import {getTicketsForOwner, resetOwnerKeys} from '../lib/persistence.js';
import {findByPrefix, getById} from '../lib/redis.js';


/**
 * 
 * @param {import('next').NextApiRequest} request 
 * @param {import('next').NextApiResponse} response 
 */
export default allowCors(async function handler(
    request,
    response
) {
    const key = Buffer.from(process.env.CIPHER_SECRET, 'hex')
    const cookies = new Cookies(request, response, { secure: true })
    const selfURL = `https://${request.headers.host}/`
    const siwe = cookies.get('siwe');
    const projectKey = request.headers['x-project-key'];
    const origin = request.headers.origin;

    // TODO: get it from cookie, but time is short so hardcode for now
    const owner = '123';

    //const test = await getTicketsForOwner('123');
    if (request.method.toLowerCase() === 'get') {

        const result = await getTicketsForOwner(owner);

        response.json(result);
        return;
    } else if (request.method.toLowerCase() === 'post') {
        // TODO: save message
    } else  if (request.method.toLowerCase() === 'delete') {
        await resetOwnerKeys(owner);

    }
    // TODO: owner from cookie

    response.json(null);

    // if (!siwe) {
    //     response.status(401).send(`No auth`);
    //     return;
    // }
    // let info, project;
    // try {
    //     info = decryptObj(key, siwe);
    //     project = decryptObj(key, projectKey);
    // } catch (e) {
    //     console.error(e)
    //     response.status(401).send(`Invalid auth`);
    // }
    // // There's no way for the page to lie about origin AFAIR, so this is a valid check
    // // if origin is falsy, it's either not a cross-origin request (local testing) or it'd fail on establishing CORS
    // if(origin && origin !== project.page) {
    //     throw Error(`This is not this project's page`)
    // }
    // console.log(project, info)
    // // use address from info and wallet from project to fetch the messages between the two
    // const msg = await getMessagesBetween(project.address, info.address)

    // response.json({
    //     address: info.address,
    //     messages: msg
    // })

})