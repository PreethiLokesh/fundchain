// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFunding {

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        bool withdrawn;
    }

    Campaign[] public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _durationDays
    ) public returns (uint256) {
        campaigns.push(Campaign({
            owner: msg.sender,
            title: _title,
            description: _description,
            goal: _goal,
            deadline: block.timestamp + (_durationDays * 1 days),
            amountRaised: 0,
            withdrawn: false
        }));
        return campaigns.length - 1;
    }

    function donate(uint256 _id) public payable {
        Campaign storage c = campaigns[_id];
        require(block.timestamp < c.deadline, "Campaign ended");
        require(msg.value > 0, "Send ETH to donate");
        c.amountRaised += msg.value;
        contributions[_id][msg.sender] += msg.value;
    }

    function withdraw(uint256 _id) public {
        Campaign storage c = campaigns[_id];
        require(msg.sender == c.owner, "Not owner");
        require(c.amountRaised >= c.goal, "Goal not reached");
        require(!c.withdrawn, "Already withdrawn");
        c.withdrawn = true;
        payable(c.owner).transfer(c.amountRaised);
    }

    function refund(uint256 _id) public {
        Campaign storage c = campaigns[_id];
        require(block.timestamp >= c.deadline, "Not ended yet");
        require(c.amountRaised < c.goal, "Goal was reached");
        uint256 amount = contributions[_id][msg.sender];
        require(amount > 0, "No contribution");
        contributions[_id][msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }
}