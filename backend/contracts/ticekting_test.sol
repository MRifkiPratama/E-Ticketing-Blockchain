// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventTicket {
    address public admin = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4; 

    uint public ticketPrice;
    uint public totalTickets;
    uint public ticketsSold;

    struct Ticket {
        address owner;
        bool isUsed;
    }

    Ticket[] public tickets;

    event TicketPurchased(address indexed buyer, uint indexed ticketId);
    event TicketTransferred(address indexed from, address indexed to, uint indexed ticketId);
    event TicketPriceUpdated(uint newPrice);
    event TotalTicketsUpdated(uint newTotal);

    constructor(uint _ticketPrice, uint _totalTickets) {
        ticketPrice = _ticketPrice;
        totalTickets = _totalTickets;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

   function buyTicket() public payable {
    // Remove this line, don't overwrite ticketPrice
    // ticketPrice = 10 ether;

    require(ticketsSold < totalTickets, "All tickets sold!");
    require(msg.value == ticketPrice, "Incorrect payment!");

    // Prevent user from buying multiple tickets
    for (uint i = 0; i < tickets.length; i++) {
        require(tickets[i].owner != msg.sender, "You already have a ticket!");
    }

    tickets.push(Ticket({
        owner: msg.sender,
        isUsed: false
    }));

    uint ticketId = tickets.length - 1;
    ticketsSold++;

    emit TicketPurchased(msg.sender, ticketId);
}

    function transferTicket(uint ticketId, address _to) public {
        require(ticketId < tickets.length, "Invalid ticket ID");
        require(tickets[ticketId].owner == msg.sender, "You don't own this ticket!");

        // Optional: prevent the recipient from already having a ticket
        for (uint i = 0; i < tickets.length; i++) {
            require(tickets[i].owner != _to, "Recipient already has a ticket!");
        }

        tickets[ticketId].owner = _to;
        emit TicketTransferred(msg.sender, _to, ticketId);
    }

    function verifyOwnership(address _user) public view returns (bool) {
        for (uint i = 0; i < tickets.length; i++) {
            if (tickets[i].owner == _user) {
                return true;
            }
        }
        return false;
    }

    function getMyTicketId() public view returns (int) {
        for (uint i = 0; i < tickets.length; i++) {
            if (tickets[i].owner == msg.sender) {
                return int(i);
            }
        }
        return -1;
    }

    // ADMIN-ONLY: update ticket price
    function setTicketPrice(uint _price) public onlyAdmin {
        ticketPrice = _price;
        emit TicketPriceUpdated(_price);
    }

    // ADMIN-ONLY: update total tickets
    function setTotalTickets(uint _total) public onlyAdmin {
        require(_total >= ticketsSold, "Cannot set lower than tickets sold");
        totalTickets = _total;
        emit TotalTicketsUpdated(_total);
    }

    // Optional helper: view contract balance
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getMyInformation() public view returns (address user, int ticketId) {
    user = msg.sender;
    ticketId = -1;
    for (uint i = 0; i < tickets.length; i++) {
        if (tickets[i].owner == msg.sender) {
            ticketId = int(i);
            break;
        }
    }
}

function deleteMyTicket() public {
    for (uint i = 0; i < tickets.length; i++) {
        if (tickets[i].owner == msg.sender) {
            tickets[i].owner = address(0);
            tickets[i].isUsed = true;
            ticketsSold--;
            break;
        }
    }
}


    receive() external payable {}
    fallback() external payable {}
}
