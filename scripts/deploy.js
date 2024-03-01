async function main() {

    const startTime = 10;
    const endTime = 3000000000;

    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts from the account:", deployer.address);
  
    // Deploy TimeWindow contract
    const Token = await ethers.getContractFactory("TimeWindow");
    const token = await Token.deploy(startTime, endTime);

    // Deploy Contribution contract
    const Contribution = await ethers.getContractFactory("Contribution");
    const contribution = await Contribution.deploy();
  
    console.log("TimeWindow address:", token.address);
    console.log("Contribution address:", contribution.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });