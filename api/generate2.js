import ssri from 'ssri';
import fs from 'fs';
import { encryptObj } from '../lib/crypt.js';

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
  const wallet = request.query.wallet
  const projectName = request.query.projectName

  console.log(`generating script for ${projectName}`)

  safeInputStrings({
    wallet, projectName
  })

  const encryptedConfig = encryptObj(key, { wallet });

  const integrityHash = (await ssri.fromStream(fs.createReadStream('./public/script.js'), {
    algorithms: ['sha384']
  })).toString()
  const integrity = `integrity="${integrityHash}"`;
  // const integrity = ``;

  const scriptSrc = new URL('/script.js', selfURL).href;


  const script = `
<script crossorigin="anonymous" src="${scriptSrc}" ${integrity}>
<supp-dapp project="${projectName}" key="${encryptedConfig}" host="${selfURL}"></supp-dapp>`

  response.setHeader('content-type', 'text/plain');
  response.send(script);

}

function safeInputStrings(inputs) {
  Object.entries(inputs).map(([k, v]) => {
    if (v.match(/['"<>]/)) {
      throw Error(`Please avoid using '"<> characters in '${k}'`)
    }
  })
}