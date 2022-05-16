import Cookies from "cookies";
import ethers from "ethers";
import { parseCookie } from "../lib/siwe.js";
import { DUMMY_CONTRACTS } from "./create.js";
// import { createProject } from "../lib/persistence.js";
// import { weightSrvRecords } from "ioredis/built/cluster/util.js";

// const provider = ethers.getDefaultProvider("rinkeby", {
//   infura: process.env.INFURA_PROJECT_ID,
// });

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
    // const wallet = siwe.address;
    const wallet = request.query.wallet;

    const savedContract = cookies.get("contract");

    try {
      const projectContract = savedContract ?? request.query?.contract;

      if (!projectContract) response.status(400).send("Invalid contract");

      const isContractOwner = await verifyContractOwnership(
        projectContract,
        wallet
      );

      if (!isContractOwner) {
        response.status(400).send("Invalid contract");
        return;
      }

      cookies.set("contract", projectContract);
      response.status(200).json(projectContract);
      return;
    } catch (err) {
      console.error(err)
      response.status(500).send(err.message);
    }
  } catch (err) {
    console.error(err)
    response.status(500).send(err.message);
  }
}

async function verifyContractOwnership(projectContract, wallet) {
  // We want dummy contracts to bypass security to allow demoing
  const shouldContractBypassSecurity =
    DUMMY_CONTRACTS.includes(projectContract);

  if (shouldContractBypassSecurity) return true;

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
