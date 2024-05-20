// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface ILottusLottery {
    function getParticipants() external view returns (address[] memory);
    function getWinner() external view returns (address);
    function isLotteryActive() external view returns (bool);
    function currentLotteryId() external view returns (uint256);
}

contract LottusNFT is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    ILottusLottery public lotteryContract;
    mapping(address => mapping(uint256 => bool)) public hasClaimedNFT;
    bool public winnerNFTMinted;

    string public winnerMetadataCID;
    string public participantMetadataCID;

    constructor(
        string memory name, 
        string memory symbol, 
        address lotteryContractAddress, 
        string memory initialWinnerCID, 
        string memory initialParticipantCID
    ) ERC721(name, symbol) {
        lotteryContract = ILottusLottery(lotteryContractAddress);
        winnerMetadataCID = initialWinnerCID;
        participantMetadataCID = initialParticipantCID;
    }

    function updateWinnerMetadataCID(string memory newCID) external onlyOwner {
        winnerMetadataCID = newCID;
    }

    function updateParticipantMetadataCID(string memory newCID) external onlyOwner {
        participantMetadataCID = newCID;
    }

    function mintWinnerNFT() external onlyOwner {
        require(!lotteryContract.isLotteryActive(), "Lottery still active");
        address winner = lotteryContract.getWinner();
        require(winner != address(0), "No winner selected");
        require(!winnerNFTMinted, "Winner NFT already minted");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(winner, newItemId);
        _setTokenURI(newItemId, string(abi.encodePacked("ipfs://", winnerMetadataCID)));
        winnerNFTMinted = true;
    }

    function claimParticipantNFT() external {
        require(!lotteryContract.isLotteryActive(), "Lottery still active");
        uint256 lotteryId = lotteryContract.currentLotteryId();
        require(!hasClaimedNFT[msg.sender][lotteryId], "NFT already claimed for this lottery");

        address[] memory participants = lotteryContract.getParticipants();
        bool isParticipant = false;

        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i] == msg.sender) {
                isParticipant = true;
                break;
            }
        }

        require(isParticipant, "You did not participate in this lottery");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, string(abi.encodePacked("ipfs://", participantMetadataCID)));

        hasClaimedNFT[msg.sender][lotteryId] = true;
    }

    function getClaimedParticipants(uint256 lotteryId) external view returns (address[] memory) {
        address[] memory participants = lotteryContract.getParticipants();
        uint256 count = 0;

        for (uint256 i = 0; i < participants.length; i++) {
            if (hasClaimedNFT[participants[i]][lotteryId]) {
                count++;
            }
        }

        address[] memory claimedParticipants = new address[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < participants.length; i++) {
            if (hasClaimedNFT[participants[i]][lotteryId]) {
                claimedParticipants[index] = participants[i];
                index++;
            }
        }

        return claimedParticipants;
    }

    function resetClaimedParticipants(uint256 lotteryId) external onlyOwner {
        require(winnerNFTMinted, "Winner NFT not minted yet");

        address[] memory participants = lotteryContract.getParticipants();

        for (uint256 i = 0; i < participants.length; i++) {
            hasClaimedNFT[participants[i]][lotteryId] = false;
        }

        winnerNFTMinted = false;
    }
}
