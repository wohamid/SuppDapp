
import ssri from 'ssri';
import fs from 'fs';
import { encryptObj } from '../lib/crypt.js';

import { CONFIG_KEY } from '../src/shared.js'

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

  response.send('test');
}