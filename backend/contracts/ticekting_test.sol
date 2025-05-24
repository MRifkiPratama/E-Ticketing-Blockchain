// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MovieTicket {
    address public admin = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

    uint public ticketPrice;
    uint public totalTickets;
    uint public ticketsSold;

    string[] public availableMovies = [
        "Godzilla x Kong: The New Empire",
        "Oppenheimer",
        "Inside Out 2",
        "Deadpool & Wolverine",
        "The Batman 2"
    ];

    string[] public availableShowtimes = ["10:00", "14:00", "20:00"];

    struct Ticket {
        address owner;
        bool isUsed;
        string movieTitle;
        string showtime;
        string seat;
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

    function buyTicket(string memory _movieTitle, string memory _showtime, string memory _seat) public payable {
        require(ticketsSold < totalTickets, "All tickets sold!");
        require(msg.value == ticketPrice, "Incorrect payment!");

        // Prevent user from buying multiple tickets
        for (uint i = 0; i < tickets.length; i++) {
            require(tickets[i].owner != msg.sender, "You already have a ticket!");
            require(
                keccak256(bytes(tickets[i].seat)) != keccak256(bytes(_seat)),
                "Seat already taken!"
            );
        }

        tickets.push(Ticket({
            owner: msg.sender,
            isUsed: false,
            movieTitle: _movieTitle,
            showtime: _showtime,
            seat: _seat
        }));

        uint ticketId = tickets.length - 1;
        ticketsSold++;

        emit TicketPurchased(msg.sender, ticketId);
    }

    function transferTicket(uint ticketId, address _to) public {
        require(ticketId < tickets.length, "Invalid ticket ID");
        require(tickets[ticketId].owner == msg.sender, "You don't own this ticket!");
        require(_to != address(0), "Invalid address!");

        // Prevent recipient from having a ticket
        for (uint i = 0; i < tickets.length; i++) {
            require(tickets[i].owner != _to, "Recipient already has a ticket!");
        }

        tickets[ticketId].owner = _to;

        emit TicketTransferred(msg.sender, _to, ticketId);
    }

    function verifyOwnership(address _user) public view returns (bool hasTicket, uint ticketId, string memory movie, string memory time, string memory seat) {
        for (uint i = 0; i < tickets.length; i++) {
            if (tickets[i].owner == _user) {
                return (true, i, tickets[i].movieTitle, tickets[i].showtime, tickets[i].seat);
            }
        }
        return (false, 0, "", "", "");
    }

    function getMyTicket() public view returns (bool hasTicket, uint ticketId, string memory movie, string memory time, string memory seat) {
        for (uint i = 0; i < tickets.length; i++) {
            if (tickets[i].owner == msg.sender) {
                return (true, i, tickets[i].movieTitle, tickets[i].showtime, tickets[i].seat);
            }
        }
        return (false, 0, "", "", "");
    }

    function setTicketPrice(uint _price) public onlyAdmin {
        ticketPrice = _price;
        emit TicketPriceUpdated(_price);
    }

    function setTotalTickets(uint _total) public onlyAdmin {
        require(_total >= ticketsSold, "Cannot set lower than tickets sold");
        totalTickets = _total;
        emit TotalTicketsUpdated(_total);
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

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    receive() external payable {}
    fallback() external payable {}
}
