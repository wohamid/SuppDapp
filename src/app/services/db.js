const ticket = {
    id: "Ticket 1",
    type: "General Support",
    state: "In Progress",
    commState: "Waiting for a reply",
    submittedBy: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    description: "Cannot Buy NFT",
  };

  const tickets = [
    ticket,
    ticket,
    ticket,
    ticket,
    ticket,
    ticket,
    ticket,
    ticket,
    ticket,
  ];

const hosturl = 'http://localhost:3000/api';

export async function loadTicketsForOwner(owner) {
    console.log('waiting');
    const path = `${hosturl}/tickets`;

    const test = await fetch(path);
    const parsed = await test.json();
    console.log(parsed);

    return parsed;
}

export async function respondToTicket(ticketId, message, user) {
  const path = `${hosturl}/tickets`;
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        ticketId,
        message,
        user
      })
    });

    if (res.status === 201) {
      const result = await res.json();
      debugger;
      return result;
    }

    return null;

  } catch(err) {
    console.log(err);
    return null;
  }

}

export async function updateTicket() {
  // await appendMessage(project.address, info.address, info.address, request.body.ticket, request.body.message)
}