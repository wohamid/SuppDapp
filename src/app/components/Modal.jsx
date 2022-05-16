import React from "react";
import MessageList from "../components/MessageList";
import { respondToTicket } from "../services/db";

const emptyState = {
  name: "",
  message: "",
  timestamp: "",
};

const emptyTicket = {
  title: "",
  description: "",
  states: [],
};

export default function Modal({
  contractAddress,
  isVisible,
  onClose,
  tickets,
  selectedTicketId,
  onTicketChanged,
}) {
  const hasTicket = Boolean(selectedTicketId !== "");
  const shouldRender = isVisible && hasTicket;
  const classNames = shouldRender ? "modal modal-open" : "modal";
  const [messageToSend, setMessageToSend] = React.useState("");

  const handleChangeInput = (event) => {
    if (event && event.target && event.target.value) {
      setMessageToSend(event.target.value);
    } else {
      setMessageToSend("");
    }
  };

  const sendMesage = async (event) => {
    if (messageToSend) {
      const result = await respondToTicket(
        contractAddress,
        ticket.id,
        messageToSend,
        ticket.user
      );
      // onTicketChanged(result);
      setMessageToSend("");
    }
  };

  const ticket = tickets.find((ticket) => ticket.id === selectedTicketId);

  return (
    <div className={classNames}>
      <div className="modal-box relative w-full">
        <label
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          x
        </label>
        <h3 className="font-bold text-lg">{ticket?.title}</h3>
        <p className="py-4">{ticket?.description}</p>
        <MessageList messages={ticket?.messages} owner={contractAddress} />
        <div className="flex items-center mt-5">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full self-ent mr-2"
            value={messageToSend}
            onChange={handleChangeInput}
          />
          <button className="btn btn-circle" onClick={sendMesage}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
