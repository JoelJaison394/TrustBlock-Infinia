// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract AIToolSubmission {
    uint256 public toolCount;

    struct AITool {
        uint256 id;
        string title;
        string description;
        string imageUrl;
        string[] flags;
        string[] tags;
        string[] models;
        string[] safetyConcerns;
        address submitter;
    }

    mapping(uint256 => AITool) public tools;

    event ToolSubmitted(uint256 indexed id, address indexed submitter);
    event ToolUpdated(uint256 indexed id, string title, string description);

    function submitTool(
        string memory _title,
        string memory _description,
        string memory _imageUrl,
        string[] memory _flags,
        string[] memory _tags,
        string[] memory _models,
        string[] memory _safetyConcerns
    ) public {
        toolCount++;
        tools[toolCount] = AITool(
            toolCount,
            _title,
            _description,
            _imageUrl,
            _flags,
            _tags,
            _models,
            _safetyConcerns,
            msg.sender
        );
        emit ToolSubmitted(toolCount, msg.sender);
    }

    function getTool(uint256 _id) public view returns (AITool memory) {
        return tools[_id];
    }

    function updateTool(uint256 _id, string memory _title, string memory _description) public {
        require(tools[_id].submitter == msg.sender, "Only submitter can update the tool");
        tools[_id].title = _title;
        tools[_id].description = _description;
        emit ToolUpdated(_id, _title, _description);
    }
}
