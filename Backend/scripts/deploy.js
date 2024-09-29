const hre = require("hardhat");

async function main() {
  // Get the deployer wallet
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy AI Tool Submission contract
  const AIToolSubmission = await hre.ethers.getContractFactory("AIToolSubmission", deployer);
  const aitoolSubmission = await AIToolSubmission.deploy();
  await aitoolSubmission.waitForDeployment(); // Wait for the deployment transaction to be mined
  console.log("AIToolSubmission deployed to:", aitoolSubmission.target); // Access contract address via `target`

  // Deploy AI Tool Voting contract
  const AIToolVoting = await hre.ethers.getContractFactory("AIToolVoting", deployer);
  const aitoolVoting = await AIToolVoting.deploy();
  await aitoolVoting.waitForDeployment(); // Wait for the deployment transaction to be mined
  console.log("AIToolVoting deployed to:", aitoolVoting.target);

  // Deploy Firewall List contract
  const AIFirewallList = await hre.ethers.getContractFactory("AIFirewallList", deployer);
  const aifirewallList = await AIFirewallList.deploy(aitoolSubmission.target, aitoolVoting.target);
  await aifirewallList.waitForDeployment(); // Wait for the deployment transaction to be mined
  console.log("AIFirewallList deployed to:", aifirewallList.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
