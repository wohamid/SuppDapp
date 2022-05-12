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
        console.log('i am in', request.query);
      const origin = request.query.origin;
      console.log({ origin });
  
      safeInputStrings({
        origin,
      })

      const contract = await getContract(origin);
      
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
  }
  
  function safeInputStrings(inputs){
    Object.entries(inputs).map(([k,v]) => {
      if(v.match(/['"<>]/)) {
        throw Error(`Please avoid using '"<> characters in '${k}'`)
      }
    })
  }

  async function getContract(origin) {
      // TODO - read from storage
      return '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'
  }