import React from "react";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import Modal from "../components/Modal";

export const snapId = "local:http://localhost:8080/";

const App = () => {
  const { ethereum } = window;

  const [wallet, setWallet] = React.useState();
  const [modalVisibility, setModalVisibility] = React.useState(false);
  const [isSignedUp, setIsSignedUp] = React.useState(false);
  const [isSnapInstalled, setIsSnapInstalled] = React.useState(false);

  React.useEffect(() => {
    if (!ethereum) return console.log("no ethereum!");
    console.log("have ethereum");

    ethereum.on("connect", console.log);
    ethereum.on("disconnect", console.log);
    ethereum.on("accountsChanged", (newAccounts) => {
      const [newWallet] = newAccounts;
      setWallet(newWallet);
    });
    initWallet();
  }, [ethereum]);

  const initWallet = async () => {
    try {
      const [newAccount] = await ethereum.request({
        method: "eth_accounts",
      });
      setWallet(newAccount);
    } catch (err) {
      console.error("Error on init when getting accounts", err);
    }
  };

  const handleOnConnectWalletClick = async () => {
    const [mmWallet] = await ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log(mmWallet);

    setWallet(mmWallet);
  };

  const handleCloseModal = () => {
    console.log("lets close");
    setModalVisibility(false);
  };

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

  const handleInstallSnapClick = async () => {
    const result = await ethereum.request({
      method: "wallet_enable",
      params: [
        {
          wallet_snap: { [snapId]: {} },
        },
      ],
    });
    console.log(result);
  };

  const tickets = [
    ticket,
    ticket,
    ticket,
    ticket,
    ticket,
    ticket,
    ticket,
    ticket,
    ticket,
  ];

  return (
    <div className="flex h-screen">
      <div className="justify-center items-center m-auto">
        <p className="text-2xl text-center my-10">SuppDapp</p>
        {!wallet && (
          <button
            className="btn btn-primary"
            onClick={handleOnConnectWalletClick}
          >
            Connect Metamask
          </button>
        )}
        {wallet && (
          <button className="btn btn-primary" onClick={handleInstallSnapClick}>
            Install Snap
          </button>
        )}
        {/* {isSignedUp ? ( */}
        {/*   <Dashboard tickets={tickets} onRowClick={handleRowClick} /> */}
        {/* ) : ( */}
        {/*   <Signup ethereum={ethereum} /> */}
        {/* )} */}
      </div>
      <Modal
        isVisible={modalVisibility}
        onClose={handleCloseModal}
        ticket={ticketDetails}
      />
    </div>
  );
};

export default App;
