/* ## The main goal of this compiler is whenever we make a change we want to remove 
our json files and have only the most undated version of our contract exist inside our json files inside build folder ##*/

// To create a path we use this module
const path = require("path");

// file system to read the directory
const fs = require("fs-extra");

// solc compiler 
const solc = require("solc");

// target the build file and remove it each time we compile it
// to have a clean code and we don't have to wait
const buildPath = path.resolve(__dirname, "build");

// looks at build file and remove it after we finish compiling
fs.removeSync(buildPath);

// <===== Read the the campaign.sol from contract folder ==> //

// look at  contracts file
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");

// read contract file
const source = fs.readFileSync(campaignPath, "utf8");

// compile contract file
const output = solc.compile(source, 1).contracts;
console.log(output);

// We should make sure that we create a build folder
fs.ensureDirSync(buildPath);

// We need to loop through the contractsOutput (has two contracts object)
// and output it in separates file inside build folder
// for in loop used to iretate over a keys of an object
for (let contract in output) {
    // outputJsonSync is going to write out some json file in some specific folder
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(":", "") + ".json"),
        output[contract]  // to put the content that we want to write on JSonfile
    );
}



















