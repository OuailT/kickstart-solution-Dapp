// to make sure that one value is equal to another
const assert = require("assert");

// ganache cli for local test network 
const ganache = require("ganache-cli");

// to get access to the smart contract on the blockchain and required instance of web3
const Web3 = require("web3");

// create an instance of web3 and get a provider
const web3 = new Web3(ganache.provider());

// get the bytecode and ABI from each compiled json file
const compileFactory = require("../ethereum/build/FactoryCampaign.json");
const compileCampaign = require("../ethereum/build/Campaign.json");


let accounts;
let factory;
let campaignAddress;
let campaign;



beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    // deploy Factory contract and CAMPAIGN CONTRACT on the ethereum blockchain
    // WE USE THIS SYNTAX(DEPLOY AND SEND) WHEN WE WANT TO DEPLOY NEW CONTRACT
    factory = await new web3.eth.Contract(JSON.parse(compileFactory.interface))
                   .deploy({data : compileFactory.bytecode})
                   .send({from: accounts[0], gas: "1000000"});
    console.log(factory);

    // send transaction = pay gas
   //  this methods created the campaign but we have no address  back from it of the campaign.
   // so use this code to get back an address/reference array stored in the method below
    await factory.methods.createCampaigns("100").send({
        from : accounts[0],
        gas: "1000000",
    });

    // To get all the lists of the contracts 
    // Because it marks as view so we are not going to change the data
    const addresses = await factory.methods.getAllCampaignsAddress().call();
    //=> assuming that accounts[0] will return address[0];
    campaignAddress = addresses[0];
    

    // Create an instance of campaign contract based on the address returned from 47
    // WE USE THIS SYNTAX WHEN THE CONTRACT IS ALREADY DEPLOYED
    // BUT WE WANNA INSTRUCT WEB3 ABOUT IT
    // SO WE PASS JUST INTERFACE AND ADDRESS
    campaign = await new web3.eth.Contract(JSON.parse(compileCampaign.interface), 
    campaignAddress
    );
});


//Test if the contracts have been deployed by checking for their ADDRESS

describe("Campaigns", ()=> {
    it("Both contracts has been deployed", ()=> {
        // assert.ok check the existence of the value;
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it("if the caller of the function is the manager", async ()=> {
        const manager = await campaign.methods.manager().call();
        // compare the address with the address who created the campaigns
        assert.equal(accounts[0], manager);
    });

    it("make sure the contributor respected the minimum + was mark as contributor", async ()=> {
        // call the methods contribute from the contract to send some money
        await campaign.methods.contribute().send({
            value: "200",
            from: accounts[1]
        });

        // check if the address of this accounts[1] has been recorded in the contributors
        const isContribute = await campaign.methods.contributors(accounts[1]).call();
        assert(isContribute);
    });

    // The test is valid when we throw an error
    it("make sure that the contributor send a minimum amount of money", async ()=> {
        try{
            await campaign.methods.contribute().send({
                value: "5",
                from: accounts[1],
            });
            assert(false);
        } 
        catch(err) {
            assert(err);
        }
    });


    it("make sure the manager is able to make a payment request", async ()=> {
        // we need to create a request by send() method
        await campaign.methods
        .createRequest("Buy Pens", "1200", accounts[2])
        .send({
            from : accounts[0],
            gas: "1000000",
        });

        // get the array where the array is stored and check it
        const request = await campaign.methods.requests(0).call();
        assert("Buy Pens", request.description);
    });

    it("process of request", async ()=> {
        // check the contribution 
        await campaign.methods.contribute().send({
            from : accounts[1],
            value: web3.utils.toWei("10", "Ether") // it better to compare balance with ether
        });

        // check if the manager created a request
        await campaign.methods
        .createRequest("Buy Pens", web3.utils.toWei("5", "Ether"), accounts[3])
        .send({
            from: accounts[0],
            gas: "1000000"
        });

        // approve request
        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: "1000000"
        });

        // finalizeRequest
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[1],
            gas: "100000"
        });

        // i used LET to resign balance variable // balance returns string
        let balance = await web3.eth.getBalance(accounts[3]); // balance Wei uni
            balance = await web3.utils.fromWei(balance, "Ether");
            balance = parseFloat(balance);
            console.log(balance);

        assert( balance > 104);
    });
});






