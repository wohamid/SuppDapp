import Message from "./Message";

const MessageList = ({ messages }) => (
  <ul className="space-y-6 grid grid-cols-1">
    {messages && messages.map((message, index) => <Message key={index} message={message} />)}
  </ul>
);

export default MessageList;
