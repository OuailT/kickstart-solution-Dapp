// import web3 from web3Js
import web3 from './web3';
import FactoryCampaign from "./build/FactoryCampaign.json";

// create an instance of factory contract to use in our application and returns all campaigns data;
const instance = new web3.eth
    .Contract(JSON.parse(FactoryCampaign.interface),
    "0xA39c0d5C671416b9fae161819C674e1101B6166f"
);

export default instance;



