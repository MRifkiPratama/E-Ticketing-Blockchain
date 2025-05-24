const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with account:", deployer.address);

    const MovieTicket = await ethers.getContractFactory("MovieTicket");

    const ticketPrice = ethers.parseEther("10");
    const totalTickets = 100;

    const movieTicket = await MovieTicket.deploy(ticketPrice, totalTickets);

    await movieTicket.deploymentTransaction().wait();

    console.log("ticketPrice (wei):", ticketPrice.toString());
    console.log("totalTickets:", totalTickets);

    const deployedAddress = await movieTicket.getAddress();
    console.log("MovieTicket deployed to:", deployedAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
