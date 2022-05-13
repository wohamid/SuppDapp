import Cookies from 'cookies'
import fetch from 'node-fetch';
import { parseCookie } from '../lib/siwe.js';
import { createKey } from '../lib/scriptHelper.js';
/**
 * 
 * @param {import('next').NextApiRequest} request 
 * @param {import('next').NextApiResponse} response 
 */
export default async function handler(
  request,
  response
) {
  try {
    const cookies = new Cookies(request, response, { secure: true })
    const siwe = parseCookie(cookies);
    if (!siwe) {
      response.status(401).send(`No auth`);
      return;
  }
  const wallet = siwe.address;

    // const wallet = request.query.wallet; // for testing
    const contract = request.query.contract;
    const projectInfo = await getProjectInfo(contract);
    
    if (!projectInfo || projectInfo.owner !== wallet) {
      response.status(403).send();
      return;
    }

    const siteUrl = projectInfo.origin;

    const scriptKey = createKey(contract, siteUrl);

    const r = await fetch(siteUrl);
    const body = await r.text(); // might be better to do this as a stream if this app were real

  if (body.includes(scriptKey)) {
    await setVerified(contract);
    response.status(200).send();
  } else {
    response.status(400).send();
    return;
  }

  } catch(err) {
    console.log(err);
    response.status(500).send();
  }

}

// TODO - read from storage
async function getProjectInfo(contract) {
  return {
    owner: 'fiewfiow',
    contract,
    origin: 'https://www.google.com',
  }
}

async function setVerified(contract) {
  // TODO - set 'verified' to true in storage
  return;
}