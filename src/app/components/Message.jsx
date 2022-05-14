// TODO: remove test const
const MY_WALLET_STORAGE = "0xc0c8E364363cf4d032eD2D2f62d8e48BB2D84420";

const Message = ({ message }) => {
  const { walletAddress, timestamp, content } = message;

  // TODO: Save auth walletAddress on localstorage & hydrate react context with it
  const isMyOwnMessage = walletAddress === MY_WALLET_STORAGE;

  const messsagesAlignment = isMyOwnMessage
    ? "place-self-end"
    : "place-self-start";

  const messageColor = isMyOwnMessage ? "badge-accent" : "badge-primary";

  return (
    <div className={`${messsagesAlignment} space-y-2`}>
      <div>
        <div className={`badge text-lg ${messageColor}`}>{content}</div>
        <h5 className="text-sm">{timestamp}</h5>
      </div>
    </div>
  );
};

export default Message;
