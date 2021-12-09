import Web3 from "web3";


// Global variable
let web3;


// check if web3 is running on the browser or on the server

if(typeof window !== "undefined" && typeof window.web3 !== "undefined") {
    // we are in the browser & we are running metamask

    // create an instance of web3 ad inject the provider to metamask.
    web3 = new Web3(window.web3.currentProvider);
}

else {
    // We are running on the server OR the user is not running metamask
    
    // set up our provider manually and connected it with infura node on the rinkeby network
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/b07c048d810e4e64881be506203a2916"
    );

    // inject the provider to web3
    web3 = new Web3(provider);

}

export default web3;




