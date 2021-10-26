require("@nomiclabs/hardhat-waffle");

// file service
const fs = require("fs")

const privateKey = fs.readFileSync(".secret").toString();
// change to env variable before production build
const projectId = "5ad8fad3d452486d97c5799773a57925"

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: []
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: []
    }
  },
  solidity: "0.8.4",
};
