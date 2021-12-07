pragma solidity ^0.4.17;


// FactoryCompaign contract
// We Keep track of all the instance of the projects/compaign has been deployed in our network
// To keep some level of security 

contract FactoryCampaign {
    // array to store Campaign adress
    address[] public deployedCampaigns;
    // Function to create a new contract and return it address
    function createCampaigns(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    // Function to return all compaigns address that has been created
    function getAllCampaignsAddress() public view returns (address[]) {
        return deployedCampaigns;
    }
    
    
}



//Create campaign contract 
contract Campaign {

    // storage variables
    address public manager;
    Request[] public requests;
    uint public minimumContribution;
    uint public contributorsCounter;
    mapping (address => bool) public contributors; 

    // struct is type reference(collection of key pairs)
    struct Request {
        string description;
        uint value;
        address recepient;
        bool complete;
        uint approvalsCount; // counted only people who voted YES
        mapping(address => bool) approuvalsCounts; // records if a specific address has voted or not;
    }

    // function to display the manager and put the minimum contribution to the project
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

   // ##### Function called when someone want to contribute to the project ###
    function contribute() public payable {
        // Check the minimum sent by the contributor
        require(msg.value > minimumContribution);
        // if true push the adress of the contributor to the mapping data
        contributors[msg.sender] = true;
        contributorsCounter++;
    }


    // ## called by the manager to make a new "spending request"##
    function createRequest(string description, uint value, address recepient ) public {
        require(msg.sender == manager);

        // create an instance of struct request data types
        Request memory newRequest = Request({
            description : description, 
            value : value,
            recepient : recepient,
            complete : false,
            approvalsCount : 0
        });

        requests.push(newRequest); // ["RequestA", "RequestB", "RequestC"]

    }

    // ## Call by the contributors to vote on "spending request"
    function approveRequest(uint index) public {
        // check if the user has contributed or not
        require(contributors[msg.sender]);
        // check if the user hasn't voted before in this request
        require(!requests[index].approuvalsCounts[msg.sender]);

        // Give the user the right to vote
        requests[index].approuvalsCounts[msg.sender] = true;
        // increat the count of the vote of the user
        requests[index].approvalsCount++;

    }

    // ## Call a function to finalize the request
    function finalizeRequest(uint index) public {
        // check if the request has a false complete
        require(!requests[index].complete);
        // check if the at least 50% of contributor voted yes to valid the request
        require(requests[index].approvalsCount > (contributorsCounter / 2));
       
        // send the money to the recepient
        requests[index].recepient.transfer(requests[index].value);

         // Mark the request as true to close it
        requests[index].complete = true;

    }
}





























































// pragma solidity ^0.4.17;

// contract CampaignFactory {
//     address[] public deployedCampaigns;

//     function createCampaign(uint minimum) public {
//         address newCampaign = new Campaign(minimum, msg.sender);
//         deployedCampaigns.push(newCampaign);
//     }

//     function getDeployedCampaigns() public view returns (address[]) {
//         return deployedCampaigns;
//     }
// }

// contract Campaign {
//     struct Request {
//         string description;
//         uint value;
//         address recipient;
//         bool complete;
//         uint approvalCount;
//         mapping(address => bool) approvals;
//     }

//     Request[] public requests;
//     address public manager;
//     uint public minimumContribution;
//     mapping(address => bool) public approvers;
//     uint public approversCount;

//     modifier restricted() {
//         require(msg.sender == manager);
//         _;
//     }

//     function Campaign(uint minimum, address creator) public {
//         manager = creator;
//         minimumContribution = minimum;
//     }

//     function contribute() public payable {
//         require(msg.value > minimumContribution);

//         approvers[msg.sender] = true;
//         approversCount++;
//     }

//     function createRequest(string description, uint value, address recipient) public restricted {
//         Request memory newRequest = Request({
//            description: description,
//            value: value,
//            recipient: recipient,
//            complete: false,
//            approvalCount: 0
//         });

//         requests.push(newRequest);
//     }

//     function approveRequest(uint index) public {
//         Request storage request = requests[index];

//         require(approvers[msg.sender]);
//         require(!request.approvals[msg.sender]);

//         request.approvals[msg.sender] = true;
//         request.approvalCount++;
//     }

//     function finalizeRequest(uint index) public restricted {
//         Request storage request = requests[index];

//         require(request.approvalCount > (approversCount / 2));
//         require(!request.complete);

//         request.recipient.transfer(request.value);
//         request.complete = true;
//     }
// }