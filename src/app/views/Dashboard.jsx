import React from "react";

const Dash = ({ tickets, onRowClick }) => {
  const handleRowClick = (ticketId) => {
    // console.log(`row of ticket ${ticketId} pressed`);
    // console.log("open modal");
    onRowClick(ticketId);
  };

  return (
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
            const { id, _, commState, user, title, createdAt } =
              item;

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
                <td>{createdAt ? new Date(createdAt).toDateString() : ''}</td>
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
