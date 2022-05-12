import { generateNonce, SiweMessage } from 'siwe';
import Cookies from 'cookies'
import { encrypt, decrypt, encryptObj } from '../lib/crypt.js';
import { allowCors } from '../lib/corsHelper.js';
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
    console.log(request.method, selfURL)
    if (request.method.toLowerCase() === 'get') {
        const nonce = generateNonce();
        // nonce could go to a Redis db and get destroyed after use for improved security, but this is the next best thing
        cookies.set('n', encrypt(key, nonce), {
            sameSite: 'none',
            maxAge: 60 * 1000
        });
        response.setHeader('Content-Type', 'text/plain');
        response.send(nonce)
    } else {
        const { body } = request;
        console.log('body', body)
        const nonce = decrypt(key, cookies.get('n'));
        try {
            if (!body.message) {
                response.status(422).send('Expected prepareMessage object as body.');
                return;
            }

            let message = new SiweMessage(body.message);
            const fields = await message.validate(body.signature);
            console.log('ms', message, nonce)
            if (fields.nonce !== nonce) {
                response.status(422).send(`Invalid nonce.`);
                return;
            }
            cookies.set('siwe', encryptObj(key, fields), {
                sameSite: 'none',
                expires: new Date(fields.expirationTime),
            });
            cookies.set('n', '', {
                maxAge: -1
            })
            response.status(200).end();
            console.log('ok')
        } catch (e) {
            cookies.set('n', '', {
                maxAge: -1
            })
            cookies.set('siwe', '', {
                maxAge: -1
            })
            response.status(401).send(e.message);
        }
    }

})