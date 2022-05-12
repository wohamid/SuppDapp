import Cookies from 'cookies'
import ethers from 'ethers';

const provider = ethers.getDefaultProvider('homestead', {
  infura: process.env.INFURA_PROJECT_ID
})

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
export default async function handler(
  request,
  response
) {
  try {
    //   const cookies = new Cookies(request, response, { secure: true })
    //   const siwe = cookies.get('siwe');
    //   if (!siwe) {
    //     response.status(401).send(`No auth`);
    //     return;
    // }
    console.log('body', request.body);
      
    const wallet = request.body.wallet;
    const projectOrigin = request.body.origin;
    const projectContract = request.body.contract;
    console.log({ wallet, projectOrigin, projectContract });

    safeInputStrings({
      wallet, projectOrigin, projectContract
    })

    const contract = new ethers.Contract(projectContract, minimalErc721Abi, provider);
    try {
      const contractOwner = await contract.owner();
      console.log('contractOwner', contractOwner)
      if (contractOwner !== wallet) {
        response.status(400).send('Invalid contract');
        return;
      }
    } catch(err) {
      console.log('error getting owner', err)
      response.status(400).send('Invalid contract');
      return;
    }

    // TODO - storage

    response.status(201).send();
    return;
  } catch(err) {
    response.status(500).send();
  }

}

function safeInputStrings(inputs){
  Object.entries(inputs).map(([k,v]) => {
    if(v.match(/['"<>]/)) {
      throw Error(`Please avoid using '"<> characters in '${k}'`)
    }
  })
}