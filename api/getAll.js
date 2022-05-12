

import getDb from '../lib/db/ipfs-db.js';

/**
 * 
 * @param {import('next').NextApiRequest} request 
 * @param {import('next').NextApiResponse} response 
 */
export default async function handler(
  request,
  response
) {
  const selfURL = `https://${request.headers.host}/`
  const key = Buffer.from(process.env.CIPHER_SECRET, 'hex')

  if (request.method.toLowerCase() === 'get') {
    const database = await getDb();

    const result = await database.getAllMessages();
    response.send(result);
  }

}