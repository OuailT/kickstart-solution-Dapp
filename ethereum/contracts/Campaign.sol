// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract FactoryCampaign {
    // array to store Campaign adress
    Campaign[] public deployedCampaigns;
    // Function to create a new contract and return it address
    function createCampaigns(uint256 minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    // Function to return all compaigns address that has been created
    function getAllCampaignsAddress() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
    
    
}

//Create campaign contract 
contract Campaign {

    // storage variables
    address public manager;
    mapping(uint256 => Request) public requests;
    uint256 public minimumContribution;
    uint256 public approversCount;
    mapping (address => bool) public approvers; 

    // struct is type reference(collection of key pairs)
    struct Request {
        string description;
        uint256 value;
        address payable recepient;
        bool complete;
        uint256 approvalCount; // counted only people who voted YES
        mapping(address => bool) approvals; // records if a specific address has voted or not;
    }

    // function to display the manager and put the minimum contribution to the project
    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

   // ##### Function called when someone want to contribute to the project ###
    function contribute() public payable {
        // Check the minimum sent by the contributor
        require(msg.value > minimumContribution, "minum contribution required");
        // if true push the adress of the contributor to the mapping data
        approvers[msg.sender] = true;
        approversCount++;
    }


    // ## called by the manager to make a new "spending request"##
    function createRequest (
        string memory description,
        uint256 value, 
        address payable recepient 
        ) public onlyManager {

        // create an instance of struct request data types
        Request storage r = requests;

            r.description = description; 
            r.value = value;
            r.recepient = recepient;
            r.complete = false;
            r.approvalsCount = 0;
        }

        // requests.push(newRequest); // ["RequestA", "RequestB", "RequestC"]

    }

    // ## Call by the contributors to vote on "spending request"
    function approveRequest(uint256 index) public {

        Request storage request = requests[index];

        // check if the user has contributed or not
        require(
            approvers[msg.sender],
            "Only contributors can approve a specific payment request"
            );

        // check if the user hasn't voted before in this request
        require(
            !request.approvals[msg.sender],
            "You have already voted to this request"
            );

        // Give the user the right to vote
        request.approuvalsCounts[msg.sender] = true;
        // increat the count of the vote of the user
        request.approvalCount++;

    }

    // ## Call a function to finalize the request
    function finalizeRequest(uint256 index) public onlyManager  {
        Request storage request = requests[index];
        
        // check if the at least 50% of contributor voted yes to valid the request
        require(
            request.approvalCount > (approversCount / 2),
            "This request needs more approvals before it can be finilize"
            );
       
       // check if the request has a false complete
        require(!request.complete, "This request has been already finalized");

        // send the money to the recepient
        request.recepient.transfer(request.value);

         // Mark the request as true to close it
        request.complete = true;

    }

    modifier onlyManager() {
        require(
            msg.sender == manager,
            "Only the campaign manager can call this function."
        ); 
        _;
    }
}