const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with account:", deployer.address);

    const EventTicket = await ethers.getContractFactory("EventTicket");

    // Constructor args
    const ticketPrice = ethers.parseEther("10");
    const totalTickets = 100;

    const eventTicket = await EventTicket.deploy(ticketPrice, totalTickets);

    // Wait for deployment transaction to be mined (optional but recommended)
    await eventTicket.deploymentTransaction().wait();

    console.log("ticketPrice (wei):", ticketPrice.toString());
    console.log("totalTickets:", totalTickets);

    // Get deployed contract address properly
    const deployedAddress = await eventTicket.getAddress();
    console.log("EventTicket deployed to:", deployedAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
