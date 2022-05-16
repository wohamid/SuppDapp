import React from "react";
import { ethers } from 'ethers';
import Dashboard from "./Dashboard"
import Signup from "./Signup"
import Modal from "../components/Modal"
import { loadTicketsForOwner } from "../services/db";
import useSiwe from '../hooks/useSiwe';

const BACKEND_ADDR = window.location.origin;

const SIGNUP_STATES = {
  idle: "idle",
  signInContractInput: "signInContractInput",
  signupForm: "signupForm",
};

const App = () => {
  const { ethereum } = window;
  const provider = React.useMemo(() => ethereum ? new ethers.providers.Web3Provider(window.ethereum): undefined, [ethereum])
  const signer = React.useMemo(() => provider && provider.getSigner(), [])

  const [wallet, setWallet] = React.useState();
  const [modalVisibility, setModalVisibility] = React.useState(false);

  useSiwe(wallet, signer);

  const [contractLoggedIn, setContractLoggedIn] = React.useState(null);
  const [contractAddressInputValue, setContractAddressInputValue] =
    React.useState("");
  const [tickets, setTickets] = React.useState([]);
  const [ticketIdOpened, setTicketIdOpened] = React.useState("");
  const [ticketDetails, setTicketDetails] = React.useState({});
  const [error, setError] = React.useState();
  const [signupState, setSignUpState] = React.useState(SIGNUP_STATES.idle);

  React.useEffect(() => {
    if (!ethereum) return console.log("no ethereum!");
    console.log("have ethereum");

    ethereum.on("accountsChanged", (newAccounts) => {
      const [newWallet] = newAccounts;
      console.log(newWallet);
      if (!newWallet) signOut();
      setWallet(newWallet);
    });
    initWallet();
    loadTickets();
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

  const signOut = async () => {
    const path = new URL("/api/signout", BACKEND_ADDR).href;
    fetch(path);
    return;
  };

  const signIn = async (contractAddress) => {
    if (!wallet) return false;

    const urlParams = contractAddress
      ? `contract=${contractAddress}&wallet=${wallet}`
      : `wallet=${wallet}`;

    const path = new URL(`/api/signin?${urlParams}`, BACKEND_ADDR).href;
    const result = await fetch(path);


    if (result.ok) {
      const contract = await result.json();
      setContractLoggedIn(contract);
      return true;
    }

    return false;
  };

  const loadTickets = async () => {
    const result = await loadTicketsForOwner(contractLoggedIn);
    setTickets(result);
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

  const buttonLabel = wallet ?? "Connect Metamask";

  // const handleRowClick = () => null

  const handleRowClick = (ticketId) => {
    console.log("In app");
    setTicketIdOpened(ticketId);
    // setTicketDetails(ticket);
    setModalVisibility(!modalVisibility);
  };

  const handleTicketChanged = (ticket) => {
    console.log("Ticket changed");
    console.log(ticket);
    setTicketDetails(ticket);
    loadTickets();
  };

  const handleSignIn = () => {
    setSignUpState(SIGNUP_STATES.signInContractInput);
  };

  const handleContractAddressValueChange = (event) => {
    const {
      target: { value },
    } = event;
    setContractAddressInputValue(value);
  };

  const handleContractAddressInputSubmit = async () => {
    const isSignedIn = await signIn(contractAddressInputValue);
    if (isSignedIn) setSignUpState(SIGNUP_STATES.idle);
  };

  const isSignedIn = contractLoggedIn;

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">SuppDapp</a>
        </div>
        <div className="flex-none">
          <button
            className="btn btn-primary"
            onClick={handleOnConnectWalletClick}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
      <div className="flex h-screen">
        <div className="justify-center items-center m-auto flex flex-col">
          {!wallet && <img className={"max-w-7xl"} src={"landing.png"} />}
          {wallet && !isSignedIn && signupState === SIGNUP_STATES.idle && (
            <div>
              <button className="btn btn-primary m-10" onClick={handleSignIn}>
                Sign in
              </button>
              <button className="btn btn-primary m-10" onClick={() => {setSignUpState(SIGNUP_STATES.signupForm)}}>
                Sign up
              </button>
            </div>
          )}
          {wallet &&
            !isSignedIn &&
            signupState === SIGNUP_STATES.signInContractInput && (
              <div className="form-control">
                <div className="m-5">
                  <label className="label">
                    <span className="label-text">Contract Address</span>
                  </label>
                  <label className="input-group">
                    <input
                      type="text"
                      placeholder="0x123"
                      className="input input-bordered"
                      name={"contractAddress"}
                      value={contractAddressInputValue}
                      onChange={handleContractAddressValueChange}
                    />
                  </label>
                </div>
                <button
                  className="btn btn-primary "
                  onClick={handleContractAddressInputSubmit}
                >
                  Submit
                </button>
              </div>
            )}
          {wallet &&
            !isSignedIn &&
            signupState === SIGNUP_STATES.signupForm && (
              <Signup onFinish={() => {setSignUpState(SIGNUP_STATES.idle)}} />
            )}
          {wallet && isSignedIn && signupState === SIGNUP_STATES.idle && (
            <Dashboard
              tickets={tickets}
              onRowClick={handleRowClick}
              onTicketUpdate={loadTickets}
            />
          )}
          {error && (
            <div className="alert alert-error shadow-lg my-20">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Error! {error}</span>
              </div>
            </div>
          )}
        </div>
        <Modal
          contractAddress={contractLoggedIn}
          isVisible={modalVisibility}
          onClose={handleCloseModal}
          tickets={tickets}
          selectedTicketId={ticketIdOpened}
        />
      </div>
    </div>
  );
};


export default App;
