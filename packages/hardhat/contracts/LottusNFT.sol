// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LottusNFT is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public participantNFTCID;
    string public winnerNFTCID;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function setParticipantNFTCID(string memory cid) external onlyOwner {
        participantNFTCID = cid;
    }

    function setWinnerNFTCID(string memory cid) external onlyOwner {
        winnerNFTCID = cid;
    }

    function mintWinnerNFT(address winner, string memory lotteryName, uint256 prizeAmount, address charity) external onlyOwner {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(winner, newItemId);
        _setTokenURI(newItemId, generateTokenURI(winnerNFTCID, winner, "Winner", lotteryName, prizeAmount, charity));
    }

    function claimParticipantNFT(address participant, string memory lotteryName, uint256 prizeAmount, address charity) external onlyOwner {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(participant, newItemId);
        _setTokenURI(newItemId, generateTokenURI(participantNFTCID, participant, "Participant", lotteryName, prizeAmount, charity));
    }

    function generateTokenURI(string memory cid, address user, string memory role, string memory lotteryName, uint256 prizeAmount, address charity) internal view returns (string memory) {
        string memory walletOrENS = toAsciiString(user);
        string memory metadata = string(abi.encodePacked(
            '{"name":"', role, ' NFT",',
            '"description":"This NFT certifies the holder as a ', role, ' in the Lottus Lottery.",',
            '"image":"ipfs://', cid, '",',
            '"attributes":', generateAttributes(walletOrENS, role, lotteryName, prizeAmount, charity),
            '}'
        ));
        return string(abi.encodePacked("data:application/json;base64,", base64Encode(bytes(metadata))));
    }

    function generateAttributes(string memory walletOrENS, string memory role, string memory lotteryName, uint256 prizeAmount, address charity) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '[',
            '{"trait_type":"Role","value":"', role, '"},',
            '{"trait_type":"ENS/Address","value":"', walletOrENS, '"},',
            '{"trait_type":"Prize Pool","value":"', uint2str(prizeAmount), '"},',
            '{"trait_type":"Lottus Name","value":"', lotteryName, '"},',
            '{"trait_type":"Charity","value":"', toAsciiString(charity), '"}',
            ']'
        ));
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function base64Encode(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        bytes memory tableBytes = bytes(table);

        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        bytes memory result = new bytes(encodedLen + 32);

        assembly {
            let tablePtr := add(tableBytes, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, mload(data)) {

            } {
                data := add(data, 3)
                let input := mload(data)

                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1)
            }

            switch mod(mload(data), 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}
