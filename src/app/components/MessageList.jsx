import Message from "./Message";

const MessageList = ({ messages, owner }) => (
  <ul className="space-y-6 grid grid-cols-1">
    {messages && messages.map((message, index) => <Message key={index} message={message} owner={owner} />)}
  </ul>
);

export default MessageList;
