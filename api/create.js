import Cookies from 'cookies'
import ethers from 'ethers';
import { parseCookie } from '../lib/siwe.js';
import { createProject } from '../lib/persistence.js';
import { createKey } from '../lib/scriptHelper.js';

export const DUMMY_CONTRACTS = ["997", "007", "0x123", "0x12345", "0x999"];

const provider = ethers.getDefaultProvider("rinkeby", {
  infura: process.env.INFURA_PROJECT_ID,
});

const minimalErc721Abi = [
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

/**
 *
 * @param {import('next').NextApiRequest} request
 * @param {import('next').NextApiResponse} response
 */
export default async function handler(request, response) {
  try {
    const cookies = new Cookies(request, response, { secure: true });
    const siwe = parseCookie(cookies);
    if (!siwe) {
      response.status(401).send(`No auth`);
      return;
    }
    const wallet = siwe.address;

    // const wallet = request.body.wallet // for testing
    const projectOrigin = new URL(request.body.origin).href;
    const projectContract = request.body.contract;
    const projectName = request.body.name;

    const key = createKey(projectContract, projectOrigin);

    safeInputStrings({
      projectOrigin,
      projectContract,
    });

    // We want dummy contracts to bypass security to allow demoing
    const shouldContractBypassSecurity =
      DUMMY_CONTRACTS.includes(projectContract);

    if (!shouldContractBypassSecurity) {
      const contract = new ethers.Contract(
        projectContract,
        minimalErc721Abi,
        provider
      );
      try {
        const contractOwner = await contract.owner();
        if (contractOwner !== wallet) {
          response.status(400).send("Invalid contract");
          return;
        }
      } catch (err) {
        response.status(400).send("Invalid contract");
        return;
      }
    }

    const project = await createProject({
      contract: projectContract,
      name: projectName,
      owner: wallet,
      origin: projectOrigin,
      key,
    });

    response.status(201).json(project);
    return;
  } catch (err) {
    response.status(500).send(err);
  }
}

function safeInputStrings(inputs) {
  Object.entries(inputs).map(([k, v]) => {
    if (v.match(/['"<>]/)) {
      throw Error(`Please avoid using '"<> characters in '${k}'`);
    }
  });
}
