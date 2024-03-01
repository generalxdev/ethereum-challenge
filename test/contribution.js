const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contribution contract", async function() {

    let Contribution;
    let contribution;
    let Token;
    let token;
    let owner;
    let addr1;

    beforeEach(async function() {
      // Get the Signers here
      [owner, addr1] = await ethers.getSigners();

      // Deploy contribution contract from owner
      Token = await ethers.getContractFactory("TimeWindow", owner);
      token = await Token.deploy(0, 2 ** 32 - 1);
      
      // Deploy contribution contract from addr1
      Contribution = await ethers.getContractFactory("Contribution", addr1);
      contribution = await Contribution.deploy(); 
    })
    
    describe("Transactions", async function() {
      it("Should fail if contribute no eth", async function() {
        // Try to contribute 0 eth
        await expect(contribution.contribute()).to.be.revertedWith("No eth sent");
      })
  
      it("Donator should receive tokens in return for his donated eth", async function() {
        
        let donateEth = 1.323;
        
        const price = 0.01;
        
        let tokenAmount = Math.floor(donateEth / price);
        
        // Set addresses for TimeWindow and Contribution contract
        await contribution.setTimeWindowAddress(token.address);
        await token.setContributionAddress(contribution.address);

        // Contribute as much as donateEth
        await contribution.contribute({value: ethers.utils.parseEther(donateEth.toString())});
  
        const mintedAmount = await token.balanceOf(addr1.address);
        expect(mintedAmount).to.equal(tokenAmount);
      });
    });
    
    describe("Events", function(){
      it("Should emit TokenIssued event when token minted to contributer", async function(){
        // Set addresses for TimeWindow and Contribution contract
        await contribution.setTimeWindowAddress(token.address);
        await token.setContributionAddress(contribution.address);

        // Contribute 1 eth
        await expect(contribution.contribute({value: ethers.utils.parseEther('1')}))
          .to.emit(contribution, 'TokenIssued')
          .withArgs(addr1.address, 1 / 0.01); // Here, assume 0.01 eth per token which is equal to MINT_PRICE in contribution contract
      });
    });
});
