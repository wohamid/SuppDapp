import Cookies from 'cookies'
import { decryptObj } from '../lib/crypt.js';

/**
 * 
 * @param {import('next').NextApiRequest} request 
 * @param {import('next').NextApiResponse} response 
 */
export default async function handler(
    request,
    response
) {
    const key = Buffer.from(process.env.CIPHER_SECRET, 'hex')
    const cookies = new Cookies(request, response, { secure: true })
    const selfURL = `https://${request.headers.host}/`
    const siwe = cookies.get('siwe');

    if (!siwe) {
        response.status(401).send(`No auth`);
        return;
    }
    try {
        const info = decryptObj(key, siwe);
        response.json({
            address: info.address,
            messages: Math.floor(Math.random()*4)+1
        })
    } catch (e) {
        response.status(401).send(`Invalid auth`);
    }


}