import { useEffect, useState } from "react";
import Web3 from "web3";
import EventTicketABI from "./abi/MovieTicket.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const movies = ["Inception", "Interstellar", "The Dark Knight", "The Matrix", "Parasite"];
const times = ["10:00", "14:00", "20:00"];
const seats = Array.from({ length: 10 }, (_, i) => `A${i + 1}`);

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [ticketPrice, setTicketPrice] = useState("");
  const [totalTickets, setTotalTickets] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [status, setStatus] = useState("");

  const [movie, setMovie] = useState(movies[0]);
  const [time, setTime] = useState(times[0]);
  const [seat, setSeat] = useState(seats[0]);

  const [transferTicketId, setTransferTicketId] = useState("");
  const [transferToAddress, setTransferToAddress] = useState("");
  const [verifyAddress, setVerifyAddress] = useState("");
  const [verifyResult, setVerifyResult] = useState("");

  const [removeStatus, setRemoveStatus] = useState("");
  const [myTicketInfo, setMyTicketInfo] = useState("");

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

      await contract.methods.buyTicket(movie, time, seat).send({
        from: account,
        value: priceWei
      });

      setStatus(`🎟️ Ticket purchased for ${movie} at ${time} (Seat ${seat})`);
      const sold = await contract.methods.ticketsSold().call();
      setTicketsSold(sold);
    } catch (error) {
      console.error(error);
      setStatus("❌ Error purchasing ticket");
    }
  }

  async function transferTicket() {
    try {
      setStatus("Transferring ticket...");
      await contract.methods
        .transferTicket(transferTicketId, transferToAddress)
        .send({ from: account });
      setStatus("✅ Ticket transferred!");
    } catch (error) {
      console.error(error);
      setStatus("❌ Transfer failed");
    }
  }

  async function verifyOwnership() {
    try {
      const result = await contract.methods.verifyOwnership(verifyAddress).call();
      if (result[0]) {
        setVerifyResult(
          `✅ Address owns a ticket — ID: ${result[1]}, Movie: ${result[2]}, Time: ${result[3]}, Seat: ${result[4]}`
        );
      } else {
        setVerifyResult("❌ Address does NOT own a ticket.");
      }
    } catch (error) {
      console.error(error);
      setVerifyResult("❌ Error verifying ownership");
    }
  }

  async function getMyTicketInfo() {
    try {
      const ticket = await contract.methods.getMyTicket().call({ from: account });
      if (!ticket[0]) {
        setMyTicketInfo("❌ You don't own a ticket.");
      } else {
        setMyTicketInfo(`🎟️ Ticket ID: ${ticket[1]}, Movie: ${ticket[2]}, Time: ${ticket[3]}, Seat: ${ticket[4]}`);
      }
    } catch (error) {
      console.error(error);
      setMyTicketInfo("❌ Error fetching ticket info.");
    }
  }

  async function removeTicket() {
    try {
      setRemoveStatus("Removing ticket...");
      await contract.methods.deleteMyTicket().send({ from: account });
      setRemoveStatus("✅ Ticket removed.");

      const sold = await contract.methods.ticketsSold().call();
      setTicketsSold(sold);
    } catch (error) {
      console.error(error);
      setRemoveStatus("❌ Error removing ticket.");
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎬 Movie Ticket DApp</h1>
      {account ? <p>Connected: {account}</p> : <p>Not connected</p>}

      <div className="my-4">
        <p>Ticket Price: {ticketPrice} ETH</p>
        <p>Total Tickets: {totalTickets}</p>
        <p>Tickets Sold: {ticketsSold}</p>
      </div>

      <hr className="my-4" />
      <h2 className="text-xl font-semibold mb-2">Buy Ticket</h2>
      <label className="block mb-1">Movie:</label>
      <select value={movie} onChange={(e) => setMovie(e.target.value)} className="border p-2 mb-2 w-full">
        {movies.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      <label className="block mb-1">Time:</label>
      <select value={time} onChange={(e) => setTime(e.target.value)} className="border p-2 mb-2 w-full">
        {times.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <label className="block mb-1">Seat:</label>
      <select value={seat} onChange={(e) => setSeat(e.target.value)} className="border p-2 mb-4 w-full">
        {seats.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <button
        onClick={buyTicket}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
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
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
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
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
      >
        Verify
      </button>
      {verifyResult && <p className="mt-2">{verifyResult}</p>}

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">My Ticket Info</h2>
      <button
        onClick={getMyTicketInfo}
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 w-full"
      >
        Check My Ticket
      </button>
      {myTicketInfo && <p className="mt-2">{myTicketInfo}</p>}

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Remove My Ticket</h2>
      <button
        onClick={removeTicket}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
      >
        Remove Ticket
      </button>
      {removeStatus && <p className="mt-2 text-red-600">{removeStatus}</p>}

      <p className="mt-6 text-blue-600 font-semibold">{status}</p>
    </div>
  );
}

export default App;
