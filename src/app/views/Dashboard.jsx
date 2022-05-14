import React from "react";

const Dash = ({ tickets, onRowClick }) => {
  const handleRowClick = (ticketId) => {
    console.log(`row of ticket ${ticketId} pressed`);
    console.log("open modal");
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
            const { id, type, state, commState, submittedBy, description } =
              item;

            return (
              <tr
                key={`${index}-ticketNumber`}
                className="hover cursor-pointer"
                onClick={handleRowClick}
              >
                <td>
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="font-bold">{id}</div>
                      <div className="text-sm opacity-50">{type}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {state}
                  <br />
                  <span className="badge badge-ghost badge-sm">
                    {commState}
                  </span>
                </td>
                <td>{submittedBy}</td>
                <td>
                  <div className="font-bold">{description}</div>
                </td>
                <td>{Date.now()}</td>
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
