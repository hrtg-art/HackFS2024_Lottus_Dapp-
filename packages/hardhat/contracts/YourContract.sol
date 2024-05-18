// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LottusLottery is Ownable {
    struct Lottery {
        uint256 id;
        string name;
        string description;
        uint256 ticketPrice;
        address charity;
        uint256 endTime;
        address[] participants;
        address winner;
        bool isActive;
    }

    struct WinnerRecord {
        address winner;
        uint256 amount;
        uint256 timestamp;
    }

    struct CharityRecord {
        address charity;
        uint256 amount;
        uint256 timestamp;
    }

    Lottery public currentLottery;
    uint256 public currentLotteryId;
    address[] public participants;

    WinnerRecord[] public winnerRecords;
    CharityRecord[] public charityRecords;

    uint256 public lastPrizeAmount;
    uint256 public lastCharityAmount;

    event LotteryCreated(uint256 indexed lotteryId, string name, address charity, uint256 endTime);
    event TicketPurchased(uint256 indexed lotteryId, address indexed participant, uint256 quantity);
    event WinnerSelected(uint256 indexed lotteryId, address indexed winner, uint256 prizeAmount);
    event PrizePoolDeposited(uint256 amount);

    constructor(address ownerAddress) {
        transferOwnership(ownerAddress);
        currentLotteryId = 0;
    }

    function createLottery(
        string memory name,
        string memory description,
        uint256 ticketPrice,
        address charity
    ) external onlyOwner {
        require(currentLottery.isActive == false || block.timestamp >= currentLottery.endTime, "Previous lottery still active");
        require(ticketPrice > 0, "Ticket price must be greater than 0");
        require(charity != address(0), "Charity address cannot be zero address");

        currentLotteryId++;
        uint256 endTime = block.timestamp + 7 days;
        delete participants; // Clear participants array for the new lottery
        currentLottery = Lottery({
            id: currentLotteryId,
            name: name,
            description: description,
            ticketPrice: ticketPrice,
            charity: charity,
            endTime: endTime,
            participants: participants,
            winner: address(0),
            isActive: true
        });

        emit LotteryCreated(currentLotteryId, name, charity, endTime);
    }

    function depositPrizePool() external payable onlyOwner {
        require(msg.value > 0, "Must send ETH to deposit prize pool");
        emit PrizePoolDeposited(msg.value);
    }

    function buyTicket(uint256 quantity) external payable {
        require(currentLottery.isActive, "No active lottery");
        require(quantity > 0, "Quantity must be greater than 0");
        require(msg.value == currentLottery.ticketPrice * quantity, "Incorrect total ticket price");
        require(block.timestamp < currentLottery.endTime, "Lottery ended");

        for (uint256 i = 0; i < quantity; i++) {
            participants.push(msg.sender);
        }

        emit TicketPurchased(currentLottery.id, msg.sender, quantity);
    }

    function endLotteryEarly() external onlyOwner {
        require(currentLottery.isActive, "No active lottery");
        require(participants.length > 0, "No participants");

        currentLottery.isActive = false;
        uint256 randomNumber = random();
        selectWinner(randomNumber);
    }

    function selectWinner(uint256 randomNumber) internal {
        address winner = participants[randomNumber % participants.length];
        uint256 balance = address(this).balance;
        uint256 prizeAmount = balance * 40 / 100;
        uint256 charityAmount = balance * 40 / 100;
        uint256 ownerAmount = balance * 10 / 100;
        uint256 carryOverAmount = balance * 10 / 100;

        payable(winner).transfer(prizeAmount);
        payable(currentLottery.charity).transfer(charityAmount);
        payable(owner()).transfer(ownerAmount);
        // El 10% restante permanece en el contrato

        currentLottery.winner = winner;
        uint256 timestamp = block.timestamp;
        winnerRecords.push(WinnerRecord({winner: winner, amount: prizeAmount, timestamp: timestamp}));
        charityRecords.push(CharityRecord({charity: currentLottery.charity, amount: charityAmount, timestamp: timestamp}));

        lastPrizeAmount = prizeAmount;
        lastCharityAmount = charityAmount;

        emit WinnerSelected(currentLottery.id, winner, prizeAmount);
    }

    function getParticipants() external view returns (address[] memory) {
        return participants;
    }

    function getWinner() external view returns (address) {
        require(!currentLottery.isActive, "Lottery still active");
        return currentLottery.winner;
    }

    function getCharity() external view returns (address) {
        require(!currentLottery.isActive, "Lottery still active");
        return currentLottery.charity;
    }

    function setDescription(string memory description) external onlyOwner {
        require(currentLottery.isActive, "No active lottery");
        currentLottery.description = description;
    }

    function getDescription() external view returns (string memory) {
        return currentLottery.description;
    }

    function getPrizePool() external view returns (uint256) {
        return address(this).balance * 40 / 100;
    }

    function getWinnerRecords() external view returns (WinnerRecord[] memory) {
        return winnerRecords;
    }

    function getCharityRecords() external view returns (CharityRecord[] memory) {
        return charityRecords;
    }

    function getLastPrizeDetails() external view returns (uint256, uint256) {
        return (lastPrizeAmount, lastCharityAmount);
    }

    function random() private view returns (uint256) {
        bytes32 colorHash = keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender));
        uint256 colorHex = uint256(colorHash) % 0xFFFFFF; // Genera un valor hexadecimal aleatorio
        bytes32 finalHash = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                block.timestamp,
                participants,
                block.difficulty,
                gasleft(),
                msg.sender,
                address(this),
                colorHex
            )
        );
        return uint256(finalHash);
    }
}
