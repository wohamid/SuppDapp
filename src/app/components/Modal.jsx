import React from "react";
import MessageList from "../components/MessageList"

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

export default function Modal({ isVisible, onClose, ticket }) {
  const hasTicket = Boolean(ticket);
  const shouldRender = isVisible && hasTicket;
  const classNames = shouldRender ? "modal modal-open" : "modal";

  const handleChangeInput = (event) => {
    console.log(event);
  };

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
        <MessageList messages={ticket.messages} />
        <div className="flex items-center mt-5">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full self-ent mr-2"
            onChange={handleChangeInput}
          />
          <button className="btn btn-circle">&gt;</button>
        </div>
      </div>
    </div>
  );
}
