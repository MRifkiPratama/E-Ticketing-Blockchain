import { useEffect, useState } from "react";
import Web3 from "web3";
import EventTicketABI from "./abi/EventTicket.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [ticketPrice, setTicketPrice] = useState("");
  const [totalTickets, setTotalTickets] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [status, setStatus] = useState("");

  const [transferTicketId, setTransferTicketId] = useState("");
  const [transferToAddress, setTransferToAddress] = useState(""); 
  const [verifyAddress, setVerifyAddress] = useState("");
  const [verifyResult, setVerifyResult] = useState("");

  const [myTicketId, setMyTicketId] = useState("");
  const [removeStatus, setRemoveStatus] = useState("");

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          const instance = new web3Instance.eth.Contract(EventTicketABI.abi, contractAddress);

          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setContract(instance);

          const price = await instance.methods.ticketPrice().call();
          const total = await instance.methods.totalTickets().call();
          const sold = await instance.methods.ticketsSold().call();

          setTicketPrice(web3Instance.utils.fromWei(price, "ether"));
          setTotalTickets(total);
          setTicketsSold(sold);
        } catch (err) {
          console.error("Connection error:", err);
          setStatus("Failed to connect wallet");
        }
      } else {
        alert("Please install MetaMask!");
      }
    }

    init();
  }, []);

  async function buyTicket() {
    try {
      setStatus("Processing purchase...");
      const priceWei = await contract.methods.ticketPrice().call();
      await contract.methods.buyTicket().send({ from: account, value: priceWei });
      setStatus("Ticket purchased successfully!");

      const sold = await contract.methods.ticketsSold().call();
      setTicketsSold(sold);
    } catch (error) {
      console.error(error);
      setStatus("Error purchasing ticket");
    }
  }

  async function transferTicket() {
    try {
      setStatus("Processing transfer...");
      await contract.methods
        .transferTicket(transferTicketId, transferToAddress)
        .send({ from: account });
      setStatus("Ticket transferred successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error transferring ticket");
    }
  }

  async function verifyOwnership() {
    try {
      const owns = await contract.methods.verifyOwnership(verifyAddress).call();
      setVerifyResult(
        owns ? `${verifyAddress} owns a ticket` : `${verifyAddress} does NOT own a ticket`
      );
    } catch (error) {
      console.error(error);
      setVerifyResult("Error verifying ownership");
    }
  }

  async function checkMyTicketId() {
    try {
      const ticketId = await contract.methods.getMyTicketId().call({ from: account });
      if (ticketId === "-1") {
        setMyTicketId("You don't own a ticket.");
      } else {
        setMyTicketId(`Your ticket ID is: ${ticketId}`);
      }
    } catch (error) {
      console.error(error);
      setMyTicketId("Error checking ticket ID");
    }
  }

  // 🆕 Fungsi untuk remove ticket
  async function removeTicket() {
    try {
      setRemoveStatus("Removing your ticket...");
      await contract.methods.removeMyTicket().send({ from: account });
      setRemoveStatus("Your ticket has been removed successfully!");

      // Update info setelah menghapus
      const sold = await contract.methods.ticketsSold().call();
      setTicketsSold(sold);
    } catch (error) {
      console.error(error);
      setRemoveStatus("Error removing ticket");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Event Ticket DApp</h1>
      {account ? <p>Connected: {account}</p> : <p>Not connected</p>}

      <div className="my-4">
        <p>Ticket Price: {ticketPrice} ETH</p>
        <p>Total Tickets: {totalTickets}</p>
        <p>Tickets Sold: {ticketsSold}</p>
      </div>

      <button
        onClick={buyTicket}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Buy Ticket
      </button>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Transfer Ticket</h2>
      <input
        type="number"
        placeholder="Ticket ID"
        value={transferTicketId}
        onChange={(e) => setTransferTicketId(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Recipient Address"
        value={transferToAddress}
        onChange={(e) => setTransferToAddress(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={transferTicket}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Transfer Ticket
      </button>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Verify Ownership</h2>
      <input
        type="text"
        placeholder="Address to check"
        value={verifyAddress}
        onChange={(e) => setVerifyAddress(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={verifyOwnership}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Verify
      </button>
      {verifyResult && <p className="mt-2">{verifyResult}</p>}

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Check My Ticket ID</h2>
      <button
        onClick={checkMyTicketId}
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
      >
        Check Ticket ID
      </button>
      {myTicketId && <p className="mt-2">{myTicketId}</p>}

      <hr className="my-6" />

      {/* 🆕 UI remove ticket */}
      <h2 className="text-xl font-semibold mb-2">Remove My Ticket</h2>
      <button
        onClick={removeTicket}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Remove My Ticket
      </button>
      {removeStatus && <p className="mt-2 text-red-600">{removeStatus}</p>}

      <p className="mt-6 text-red-600 font-semibold">{status}</p>
    </div>
  );
}

export default App;
