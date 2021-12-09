// In order to deploy our contract we need to install 
/* npm install @truffle/hdwallet-provider => give us the possibility to connect to a "node on the Rinkeby network" using Infura API and to unlock an "account" by using "Account mnemonic"
*/ 

// require truffle provider
const HDwalletProvider = require("@truffle/hdwallet-provider");

// Require web
const Web3 = require ("web3");

// import the interface & byteCode of our Factory contract
const compiledFactory = require("../ethereum/build/FactoryCampaign.json");

// connect my truffle provider with my metamask accounts &
const provider = new HDwalletProvider(
    "visual junior kingdom sound play welcome powder earn tag seek scissors spider",
    "https://rinkeby.infura.io/v3/b07c048d810e4e64881be506203a2916"
);

// connect my provider(account/infuraNode) with web3
const web3 = new Web3(provider);

// create async function to deploy our contract 


const deploy = async () => {
    // We can generate many accounts with account (12 words);
    const accounts = await web3.eth.getAccounts();
    
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                    .deploy({data : compiledFactory.bytecode })
                    .send({ from : accounts[0], gas: "1000000"});
    
    console.log(`the contract has been deployed at ${result.options.address}`);

    // To prevent hanging development         
    provider.engine.stop();
}

deploy();


