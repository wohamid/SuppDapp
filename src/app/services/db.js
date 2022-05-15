const hosturl = 'http://localhost:3000/api';

export async function loadTicketsForOwner(owner) {
    const path = `${hosturl}/tickets`;

    const test = await fetch(path);
    const parsed = await test.json();

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
      return result;
    }

    return null;

  } catch(err) {
    console.log(err);
    return null;
  }

}