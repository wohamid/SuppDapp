const hosturl = process.env.BACKEND_HOST;

export async function loadTicketsForOwner(owner) {
    
    const path = new URL(`/api/tickets?owner=${owner}`, hosturl).href;

    const test = await fetch(path);
    const parsed = await test.json();

    return parsed;
}

export async function respondToTicket(owner, ticketId, message, user) {
    const path = new URL(`/api/tickets`, hosturl).href;
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        ticketId,
        message,
        user,
        owner
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
