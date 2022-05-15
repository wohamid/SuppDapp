import Cookies from "cookies";
import ethers from "ethers";
// import { parseCookie } from "../lib/siwe.js";
// import { createProject } from "../lib/persistence.js";
// import { weightSrvRecords } from "ioredis/built/cluster/util.js";

// const provider = ethers.getDefaultProvider("rinkeby", {
//   infura: process.env.INFURA_PROJECT_ID,
// });

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
    cookies.set("contract", "", {
      maxAge: -1,
    });

    response.status(200).end();

    return;
  } catch (err) {
    response.status(500).send();
  }
}

function safeInputStrings(inputs) {
  Object.entries(inputs).map(([k, v]) => {
    if (v.match(/['"<>]/)) {
      throw Error(`Please avoid using '"<> characters in '${k}'`);
    }
  });
}
