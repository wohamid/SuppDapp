import Cookies from "cookies";
import { allowCors } from "../lib/corsHelper.js";
import {
  getTicketsForOwner,
  resetOwnerKeys,
  appendMessage,
} from "../lib/persistence.js";
// const owner = process.env.OWNER;

/**
 *
 * @param {import('next').NextApiRequest} request
 * @param {import('next').NextApiResponse} response
 */
export default allowCors(async function handler(request, response) {
  const key = Buffer.from(process.env.CIPHER_SECRET, "hex");
  const cookies = new Cookies(request, response, { secure: true });
  const selfURL = `https://${request.headers.host}/`;
  const siwe = cookies.get("siwe");
  const projectKey = request.headers["x-project-key"];
  const origin = request.headers.origin;

  // TODO: get it from cookie, but time is short so hardcode for now

  //const test = await getTicketsForOwner('123');
  if (request.method.toLowerCase() === "get") {
    const owner = request.query?.owner;

    if (!owner) {
      response.status(404).send("no contract provided");
      return;
    }
    const result = await getTicketsForOwner(owner);

    response.json(result);
    return;
  } else if (request.method.toLowerCase() === "post") {
    // TODO: save message
    const body = request.body; // should be a ticket id and message content
    const result = await appendMessage(
      body.owner,
      body.user,
      body.owner,
      body.ticketId,
      body.message
    );
    const payload = result[body.ticketId];
    payload.id = body.ticketId;
    response.status(201).json(payload);
    return;
  } else if (request.method.toLowerCase() === "delete") {
    await resetOwnerKeys(owner);
  }
  response.json(null);
});
