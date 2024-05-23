// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LottusNFT.sol";

contract LottusLottery is Ownable {
    struct Lottery {
        uint256 id;
        string name;
        string description;
        string bannerCID;
        string winnerNFTCID;
        string participantNFTCID;
        uint256 ticketPrice;
        address charity;
        address[] participants;
        address winner;
        bool isActive;
        uint256 endTime;
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

    struct User {
        uint256 level;
        uint256 participationCount;
        uint256 totalDonations;
        uint256 totalSpent;
        mapping(string => bool) badges;
        string[] badgeList;
    }

    Lottery public currentLottery;
    uint256 public currentLotteryId;
    address[] public participants;

    WinnerRecord[] public winnerRecords;
    CharityRecord[] public charityRecords;

    uint256 public lastPrizeAmount;
    uint256 public lastCharityAmount;

    mapping(address => User) public users;
    mapping(address => bool) public participantsMap;

    event LotteryCreated(uint256 indexed lotteryId, string name, address charity, uint256 endTime);
    event TicketPurchased(uint256 indexed lotteryId, address indexed participant, uint256 quantity);
    event WinnerSelected(uint256 indexed lotteryId, address indexed winner, uint256 prizeAmount);
    event PrizePoolDeposited(uint256 amount);
    event BannerCIDUpdated(uint256 indexed lotteryId, string newBannerCID);
    event BadgeAwarded(address indexed user, string badge);

    constructor(address ownerAddress) {
        transferOwnership(ownerAddress);
        currentLotteryId = 0;
    }

    function createLottery(
        string memory name,
        string memory description,
        string memory bannerCID,
        string memory winnerNFTCID,
        string memory participantNFTCID,
        uint256 ticketPrice,
        address charity,
        uint256 duration // nuevo parámetro de duración en segundos
    ) external onlyOwner {
        require(!currentLottery.isActive || block.timestamp >= currentLottery.endTime, "Previous lottery still active");
        require(ticketPrice > 0, "Ticket price must be greater than 0");
        require(charity != address(0), "Charity address cannot be zero address");

        currentLotteryId++;
        uint256 endTime = block.timestamp + duration;
        delete participants; // Clear participants array for the new lottery
        currentLottery = Lottery({
            id: currentLotteryId,
            name: name,
            description: description,
            bannerCID: bannerCID,
            winnerNFTCID: winnerNFTCID,
            participantNFTCID: participantNFTCID,
            ticketPrice: ticketPrice,
            charity: charity,
            endTime: endTime,
            participants: participants,
            winner: address(0),
            isActive: true
        });

        emit LotteryCreated(currentLotteryId, name, charity, endTime);
    }

    function updateBannerCID(string memory newBannerCID) external onlyOwner {
        require(currentLottery.isActive, "No active lottery");
        currentLottery.bannerCID = newBannerCID;
        emit BannerCIDUpdated(currentLottery.id, newBannerCID);
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

        if (!participantsMap[msg.sender]) {
            participantsMap[msg.sender] = true;
            users[msg.sender].participationCount++;
            users[msg.sender].level = users[msg.sender].participationCount / 1; // Increment level for every 5 participations
        }

        for (uint256 i = 0; i < quantity; i++) {
            participants.push(msg.sender);
        }

        users[msg.sender].totalSpent += msg.value;

        emit TicketPurchased(currentLottery.id, msg.sender, quantity);

        // Award badges based on participation count
        if (users[msg.sender].participationCount == 1) {
            awardBadge(msg.sender, "Newcomer");
        }
        if (users[msg.sender].participationCount == 5) {
            awardBadge(msg.sender, "Regular Participant");
        }
        if (users[msg.sender].participationCount == 10) {
            awardBadge(msg.sender, "Frequent Player");
        }
        if (users[msg.sender].participationCount == 20) {
            awardBadge(msg.sender, "Seasoned Player");
        }
        if (users[msg.sender].participationCount == 50) {
            awardBadge(msg.sender, "Veteran Player");
        }
        if (users[msg.sender].participationCount == 100) {
            awardBadge(msg.sender, "Centurion");
        }
        if (users[msg.sender].participationCount == 200) {
            awardBadge(msg.sender, "Double Centurion");
        }
        if (users[msg.sender].participationCount == 500) {
            awardBadge(msg.sender, "Half Millennia Master");
        }

        // Award badges based on total spent
        if (users[msg.sender].totalSpent >= 0.1 ether) {
            awardBadge(msg.sender, "Bronze Donor");
        }
        if (users[msg.sender].totalSpent >= 0.5 ether) {
            awardBadge(msg.sender, "Silver Donor");
        }
        if (users[msg.sender].totalSpent >= 1 ether) {
            awardBadge(msg.sender, "Gold Donor");
        }
        if (users[msg.sender].totalSpent >= 2 ether) {
            awardBadge(msg.sender, "Platinum Donor");
        }
        if (users[msg.sender].totalSpent >= 5 ether) {
            awardBadge(msg.sender, "Diamond Donor");
        }
        if (users[msg.sender].totalSpent >= 10 ether) {
            awardBadge(msg.sender, "Master Philanthropist");
        }
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

        // Award badge for winning
        awardBadge(winner, "LuckyWinner");
    }

    function awardBadge(address user, string memory badge) internal {
        if (!users[user].badges[badge]) {
            users[user].badges[badge] = true;
            users[user].badgeList.push(badge);
            emit BadgeAwarded(user, badge);
        }
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

    function getDescription() external view returns (string memory) {
        return currentLottery.description;
    }

    function getBannerCID() external view returns (string memory) {
        return currentLottery.bannerCID;
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

    function getWinnerNFTCID() external view returns (string memory) {
        return currentLottery.winnerNFTCID;
    }

    function getParticipantNFTCID() external view returns (string memory) {
        return currentLottery.participantNFTCID;
    }

    function isLotteryActive() external view returns (bool) {
        return currentLottery.isActive;
    }

    function random() private view returns (uint256) {
        bytes32 finalHash = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                block.timestamp,
                participants,
                block.difficulty,
                gasleft(),
                msg.sender,
                address(this)
            )
        );
        return uint256(finalHash);
    }

    function hasBadge(address user, string memory badge) external view returns (bool) {
        return users[user].badges[badge];
    }

    function getUserLevel(address user) external view returns (uint256) {
        return users[user].level;
    }

    function getUserBadges(address user) external view returns (string[] memory) {
        return users[user].badgeList;
    }
}
