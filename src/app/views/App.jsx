import React from "react";
import Dashboard from "./Dashboard"
import Signup from "./Signup"
import Modal from "../components/Modal"
import getRedis, { testKeys } from "../../../lib/redis";
import { loadTicketsForOwner } from "../services/db";

export const snapId = "local:http://localhost:8080/";

const App = () => {
  const { ethereum } = window;

  const [wallet, setWallet] = React.useState();
  const [modalVisibility, setModalVisibility] = React.useState(false);
  const [isSignedUp, setIsSignedUp] = React.useState(false);

  // bypass snap
  const [isSnapInstalled, setIsSnapInstalled] = React.useState(true);
  const [tickets, setTickets] = React.useState([]);

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
    loadTickets();
    // getSnaps();
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

  const getSnaps = async () => {
    const result = await ethereum.request({ method: "wallet_getSnaps" });

    const snapInstalledWithPermission = Boolean(
      result[snapId] && !result[snapId].error
    );

    console.log(result);
    setIsSnapInstalled(snapInstalledWithPermission);
  };

  const loadTickets = async () => {
    const result = await loadTicketsForOwner('123');
    setTickets(result);
  }

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
  console.log('in');

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
    if (!result.snaps[snapId].error) setIsSnapInstalled(true);
  };

  const getButtonLabel = () => {
    if (!wallet) return "Connect Metamask";
    if (wallet && !isSnapInstalled) return "Install Snap";
    return wallet;
  };

  const getButtonHandler = () => {
    if (!wallet) return handleOnConnectWalletClick;
    if (wallet && !isSnapInstalled) return handleInstallSnapClick;
    return null;
  };


  // React.useEffect(() => {
  //   getTickets();
  // }, []);


  const handleSignupSubmit = () => {
    setIsSignedUp(true)
  }

  const buttonLabel = getButtonLabel();
  const buttonClickHandler = getButtonHandler();

  const isSetupComplete = wallet && isSnapInstalled;

  const handleRowClick = () => null

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">SuppDapp</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-primary" onClick={buttonClickHandler}>
            {buttonLabel}
          </button>
        </div>
      </div>
      <div className="flex h-screen">
        <div className="justify-center items-center m-auto">
          {!isSetupComplete && <img src={"assets/landing.png"} />}
          {isSetupComplete && <Dashboard tickets={tickets} onRowClick={handleRowClick} />}
          {/* {isSetupComplete && !isSignedUp && <Signup ethereum={ethereum} onSubmit={handleSignupSubmit} />} */}
          {/* {isSignedUp && <Dashboard tickets={tickets} onRowClick={handleRowClick} />} */}
        </div>
        <Modal
          isVisible={modalVisibility}
          onClose={handleCloseModal}
          ticket={ticketDetails}
        />
      </div>
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
