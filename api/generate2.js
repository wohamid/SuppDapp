import { getProjectByContract } from '../lib/persistence.js';

/**
 * 
 * @param {import('next').NextApiRequest} request 
 * @param {import('next').NextApiResponse} response 
 */
export default async function handler(
  request,
  response
) {
  const host = request.headers.host;
  const selfURL = `https://${host.includes('127.0.0.') ? `${request.headers['x-forwarded-host']}` : host}/`
  
  const address = request.query.address
  const projectInfo = await getProjectByContract(address);

  if (!projectInfo) {
    response.status(404).send();
    return;
  }


  // const projectName = request.query.projectName
  // const page = new URL(request.query.page).origin;

  console.log(`generating script for ${projectInfo.name}`)

  try {

    // const integrityHash = (await ssri.fromStream(fs.createReadStream('./public/script.js'), {
    //   algorithms: ['sha384']
    // })).toString()
    // const integrity = `integrity="${integrityHash}"`;
    const integrity = ``;

    const scriptSrc = new URL('/script.js', selfURL).href;
    console.log('scriptSrc', scriptSrc);


    const script = `
<script crossorigin="anonymous" src="${scriptSrc}" ${integrity}></script>
<supp-dapp project="${projectInfo.name}" key="${projectInfo.key}" host="${selfURL}"></supp-dapp>`
console.log('script', script);

    response.setHeader('content-type', 'text/plain');
    response.send(script);
  } catch (err) {
    console.error(err);
    response.status(500).send(err.message)
  }

}