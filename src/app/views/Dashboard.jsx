import React from "react";

const Dash = ({ tickets, onRowClick, onTicketUpdate }) => {
  const handleRowClick = (ticket) => {
    // console.log(`row of ticket ${ticketId} pressed`);
    // console.log("open modal");
    const ticketId = ticket.id;
    onRowClick(ticketId);
  };

  const updateTickets = React.useCallback(() => setTimeout(onTicketUpdate, 3000), [
    onTicketUpdate,
  ]);

  React.useEffect(() => {
    updateTickets();
  });

  return tickets.length < 1 ? (
    <div className="alert shadow-lg">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info flex-shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>You have no tickets</span>
      </div>
    </div>
  ) : (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Ticket #</th>
            <th>state</th>
            <th>submitted by</th>
            <th>description</th>
            <th>created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((item, index) => {
            const { id, _, commState, user, title, createdAt } = item;

            return (
              <tr
                key={id}
                className="hover cursor-pointer"
                onClick={() => handleRowClick(item)}
              >
                <td>
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="text-sm opacity-50">Ticket</div>
                      <div className="font-bold">{id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  In Progress
                  <br />
                  <span className="badge badge-ghost badge-sm">
                    {commState}
                  </span>
                </td>
                <td>{user}</td>
                <td>
                  <div className="font-bold">{title}</div>
                </td>
                <td>{createdAt ? new Date(createdAt).toDateString() : ""}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th>Ticket #</th>
            <th>state</th>
            <th>submitted by</th>
            <th>description</th>
            <th>created</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Dash;
