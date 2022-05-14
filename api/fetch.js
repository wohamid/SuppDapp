import { allowCors } from '../lib/corsHelper.js';
import { getProjectByOrigin } from '../lib/persistence.js';
/**
 * 
 * @param {import('next').NextApiRequest} request 
 * @param {import('next').NextApiResponse} response 
 */
 export default allowCors(async function handler(
    request,
    response
  ) {
    try {
      const origin = request.query.origin;
  
      safeInputStrings({
        origin,
      })

      const project = await getProjectByOrigin(origin);

      if (!project) {
        response.status(404).send();
        return;
     }

     const { contract } = project;
      
      if (!contract) {
         response.status(404).send();
         return;
      }

      response.status(200).json({
          contract,
      })
      return;
    } catch(err) {
      response.status(500).send();
    }
  });
  
  function safeInputStrings(inputs){
    Object.entries(inputs).map(([k,v]) => {
      if(v.match(/['"<>]/)) {
        throw Error(`Please avoid using '"<> characters in '${k}'`)
      }
    })
  }

