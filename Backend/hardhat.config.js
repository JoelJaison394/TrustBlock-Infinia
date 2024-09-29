require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.18",
  networks: {
    polygonAmoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/JnWQIljVFhSUEewAEEbi4D5Tbrwo1gBS",
      accounts: ["d3ba5451e569243c774c291606528a1668aca8769278c9e230449b8544953cf4"]
    }
  }
};
