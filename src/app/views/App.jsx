import React from "react";
import Dashboard from "./Dashboard"
import Signup from "./Signup"
import Modal from "../components/Modal"
import getRedis, { testKeys } from "../../../lib/redis";
import { loadTicketsForOwner } from "../services/db";

const App = () => {
  const [wallet, setWallet] = React.useState();
  const [modalVisibility, setModalVisibility] = React.useState(false);
  const [isSignedUp, setIsSignedUp] = React.useState(true);
  const [tickets, setTickets] = React.useState([]);

  const handleOnConnectWalletClick = async () => {
    const { ethereum } = window;
    const [mmWallet] = await ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log(mmWallet)

    setWallet(mmWallet);
  };
  const handleRowClick = () => {
    setModalVisibility(!modalVisibility);
  };

  const handleCloseModal = () => {
    console.log("lets close");
    setModalVisibility(false);
  };

  const buttonText = wallet ?? "Connect Wallet";

  const ticket = {
    id: "Ticket 1",
    type: "General Support",
    state: "In Progress",
    commState: "Waiting for a reply",
    submittedBy: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    description: "Cannot Buy NFT",
  };

  const userMessage = {
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    timestamp: Date.now(),
    content: "Hello, I need help",
  };
  const myMessage = {
    walletAddress: "0xc0c8E364363cf4d032eD2D2f62d8e48BB2D84420",
    timestamp: Date.now(),
    content: "Hi, how can I help you",
  };

  const ticketDetails = {
    id: 1,
    title: "Cannot Buy NFT",
    description: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    messages: [userMessage, myMessage, userMessage, myMessage, userMessage],
  };
  console.log('in');

  const getTickets = async () => {
    console.log('start');

    const tickets = await loadTicketsForOwner(999);
    console.log(tickets);
    setTickets(tickets);
  }

  React.useEffect(() => {
    getTickets();
  }, []);
  console.log('after');


  const handleSignupSubmit = () => {
    setIsSignedUp(true)
  }

  return (
    <div>
      <div className="container mx-auto">
        <div className="container flex justify-end my-10">
          <button
            className="btn btn-primary"
            onClick={handleOnConnectWalletClick}
          >
            {buttonText}
          </button>
        </div>
        
        {isSignedUp ? <Dashboard tickets={tickets} onRowClick={handleRowClick} /> : <Signup onSubmit={handleSignupSubmit} />}
      </div>
      <Modal
        isVisible={modalVisibility}
        onClose={handleCloseModal}
        ticket={ticketDetails}
      />
    </div>
  );
};

// async function loadTickets() {
//   return new Promise((resolve) => {
//     const tickets = await loadTicketsForOwner(999)
//     console.log(tickets);

//     resolve([{
//       id: "Ticket 1",
//       type: "General Support",
//       state: "In Progress",
//       commState: "Waiting for a reply",
//       submittedBy: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
//       description: "Cannot Buy NFT",
//     }]);
//   })
// }

export default App;
