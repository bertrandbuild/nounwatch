import { expect } from "chai";
import { ethers } from "hardhat";
import { Manager } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("YourContract", function () {
  // We define a fixture to reuse the same setup in every test.

  const creditPrice = 1;
  const hundredCredits = 100;

  const fileInfo = {
    fileId: 1,
    transcriptCid: "transcriptCid1",
    analysisCid: "analysisCid1",
  };

  let managerContract: Manager;

  async function deployManagerFixture(): Promise<Manager> {
    const managerContracts = await ethers.deployContract("Manager", [creditPrice]);

    return managerContracts;
  }

  before(async () => {
    managerContract = await loadFixture(deployManagerFixture);
  });

  it("Should be deployed correctly", async function () {
    expect(await managerContract.getAddress()).not.to.equal(ethers.ZeroAddress);
  });

  describe("User logic", function () {
    beforeEach(async () => {
      const value = hundredCredits * creditPrice;
      await managerContract.fundUser(hundredCredits, { value: value });
    });

    it("Should be able to fund a user", async function () {
      const [owner] = await ethers.getSigners();
      const userCredits = await managerContract.getUserCredits(owner);
      expect(userCredits).to.equal(hundredCredits);
    });
  });

  describe("File logic", function () {
    beforeEach(async () => {
      await managerContract.createFile(fileInfo.fileId, fileInfo.transcriptCid, fileInfo.analysisCid);
    });

    it("Should be able to create a non existent file", async function () {
      const tx = managerContract.getFile(fileInfo.fileId);

      await expect(tx)
        .to.emit(managerContract, "FileInformation")
        .withArgs(fileInfo.fileId, fileInfo.transcriptCid, fileInfo.analysisCid);
    });
  });

  describe("Manger logic", function () {
    beforeEach(async () => {
      await managerContract.updateCreditPrice(2);
    });

    it("Should be able to update the credit fee", async function () {
      const newCreditPrice = await managerContract.creditsPrice();
      expect(newCreditPrice).to.equal(2);
    });
  });
});
