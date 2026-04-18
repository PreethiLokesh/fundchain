const hre = require("hardhat");

async function main() {
  console.log("Deploying CrowdFunding contract...");

  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const crowdFunding = await CrowdFunding.deploy();

  await crowdFunding.waitForDeployment();

  const address = await crowdFunding.getAddress();
  console.log("CrowdFunding deployed to:", address);
  console.log("Copy this address — you'll need it for the frontend!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});