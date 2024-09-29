// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract AIToolVoting {
    struct Vote {
        uint256 upvotes;
        uint256 downvotes;
        mapping(address => bool) voters;
        mapping(address => string) reasons;
    }

    mapping(uint256 => Vote) public toolVotes;
    event Voted(uint256 indexed toolId, address indexed voter, bool isUpvote, string reason);

    function upvoteTool(uint256 toolId, string memory reason) public {
        require(!toolVotes[toolId].voters[msg.sender], "Already voted");

        toolVotes[toolId].upvotes++;
        toolVotes[toolId].voters[msg.sender] = true;
        toolVotes[toolId].reasons[msg.sender] = reason;
        emit Voted(toolId, msg.sender, true, reason);
    }

    function downvoteTool(uint256 toolId, string memory reason) public {
        require(!toolVotes[toolId].voters[msg.sender], "Already voted");

        toolVotes[toolId].downvotes++;
        toolVotes[toolId].voters[msg.sender] = true;
        toolVotes[toolId].reasons[msg.sender] = reason;
        emit Voted(toolId, msg.sender, false, reason);
    }

    function getVotes(uint256 toolId) public view returns (uint256 upvotes, uint256 downvotes) {
        return (toolVotes[toolId].upvotes, toolVotes[toolId].downvotes);
    }

    function getReasonForVote(uint256 toolId, address voter) public view returns (string memory) {
        return toolVotes[toolId].reasons[voter];
    }
}
