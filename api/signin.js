import Cookies from "cookies";
import ethers from "ethers";
import { parseCookie } from "../lib/siwe.js";
import { createProject } from "../lib/persistence.js";
import { weightSrvRecords } from "ioredis/built/cluster/util.js";

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
    // const siwe = parseCookie(cookies);
    // if (!siwe) {
    //   response.status(401).send(`No auth`);
    //   return;
    // }
    // const savedContract = cookies.get("contract");
    // const wallet = siwe.address;

    // const wallet = request.body.wallet // for testing
    const projectContract = request.body.contract;
    const wallet = request.body.wallet.

    safeInputStrings({
      projectOrigin,
      projectContract,
    });

    const isContractOwner = await verifyContractOwnership(projectContract, wallet);

    if (!isContractOwner) {
      response.status(400).send("Invalid contract");
      return;
    }

    cookies.set("contract", projectContract);
    response.status(200).json(projectContract);
    return;
  } catch (err) {
    response.status(500).send();
  }
}

async function verifyContractOwnership(projectContract, wallet) {
  if (projectContract === process.env.CONTRACT) return true

    const contract = new ethers.Contract(
      projectContract,
      minimalErc721Abi,
      provider
    );
  try {
    const contractOwner = await contract.owner();
    return contractOwner === wallet;
  } catch (err) {
    return false;
  }
}

function safeInputStrings(inputs) {
  Object.entries(inputs).map(([k, v]) => {
    if (v.match(/['"<>]/)) {
      throw Error(`Please avoid using '"<> characters in '${k}'`);
    }
  });
}
