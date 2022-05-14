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
  const address = request.query.address
  const projectName = request.query.projectName
  const page = new URL(request.query.page).origin;

  console.log(`generating script for ${projectName}`)

  try {
    safeInputStrings({
      address, projectName, page
    })

    const encryptedConfig = encryptObj(key, { address: address, page });

    // const integrityHash = (await ssri.fromStream(fs.createReadStream('./public/script.js'), {
    //   algorithms: ['sha384']
    // })).toString()
    // const integrity = `integrity="${integrityHash}"`;
    const integrity = ``;

    const scriptSrc = new URL('/script.js', selfURL).href;


    const script = `
<script crossorigin="anonymous" src="${scriptSrc}" ${integrity}></script>
<supp-dapp project="${projectName}" key="${encryptedConfig}" host="${selfURL}"></supp-dapp>`

    response.setHeader('content-type', 'text/plain');
    response.send(script);
  } catch (err) {
    response.status(500).send(err.message)
  }

}

function safeInputStrings(inputs) {
  Object.entries(inputs).map(([k, v]) => {
    if (!v) {
      throw Error(`Expected param: '${k}'`)
    }
    if (v.match(/['"<>]/)) {
      throw Error(`Please avoid using '"<> characters in '${k}'`)
    }
  })
}