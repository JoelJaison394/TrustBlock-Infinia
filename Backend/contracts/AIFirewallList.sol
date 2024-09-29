// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./AIToolSubmission.sol";
import "./AIToolVoting.sol";

contract AIFirewallList {
    AIToolSubmission public toolSubmission;
    AIToolVoting public toolVoting;
    uint256 public minDownvotesForBlock = 50;
    string[] public blockList;

    event BlockListGenerated(string[] blockList);

    constructor(address _toolSubmissionAddress, address _toolVotingAddress) {
        toolSubmission = AIToolSubmission(_toolSubmissionAddress);
        toolVoting = AIToolVoting(_toolVotingAddress);
    }

    function generateBlockList() public {
        delete blockList;
        for (uint256 i = 1; i <= toolSubmission.toolCount(); i++) {
            (, uint256 downvotes) = toolVoting.getVotes(i);
            AIToolSubmission.AITool memory tool = toolSubmission.getTool(i);

            if (downvotes >= minDownvotesForBlock || containsFlag(tool.flags, "banned")) {
                blockList.push(tool.title);
            }
        }
        emit BlockListGenerated(blockList);
    }

    function containsFlag(string[] memory flags, string memory flag) internal pure returns (bool) {
        for (uint256 i = 0; i < flags.length; i++) {
            if (keccak256(abi.encodePacked(flags[i])) == keccak256(abi.encodePacked(flag))) {
                return true;
            }
        }
        return false;
    }

    function getBlockList() public view returns (string[] memory) {
        return blockList;
    }
}
