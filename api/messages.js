

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
    const currentParams = request.query;

    if (currentParams) {
      const database = getDb();

      let result = {};
      if (currentParams.owner){
        result = await database.getAllMessagesForOwner(currentParams.owner);
      } else if (currentParams.user) {
        result = await database.getAllMessagesForUser(currentParams.user);
      } else if (currentParams.testall) {
        result = await database.getAll();
      }

      response.send(result);
      return;
    }

    response.status(400).send('Invalid route parameters!');
  } else if (request.method.toLowerCase() === 'post') {
    const body = request.body;

    if (body.createdBy && body.owner && body.content) {
      const database = getDb();

      const result = await database.addMesage(body.createdBy, body.owner, body.content);

      result.status(201).send(result);
      return;
    }

    response.status(400).send('Invalid model data!');
  }

}