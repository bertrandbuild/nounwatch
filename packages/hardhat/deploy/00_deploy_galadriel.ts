import { ethers } from "hardhat";

const AGENT_PROMPT = "Your are an AI assistant expert in finance and market psychology.";

async function main() {
  const oracleAddress: string = await deployOracle();
  console.log();
  console.log();
  await deployChatGptWithKnowledgeBase("ChatGpt", oracleAddress, "");
  for (const contractName of ["OpenAiChatGpt", "GroqChatGpt"]) {
    await deployChatGpt(contractName, oracleAddress);
  }
}

async function deployOracle(): Promise<string> {
  const oracle = await ethers.deployContract("ChatOracle", [], {});

  await oracle.waitForDeployment();

  console.log(`Oracle deployed to ${oracle.target}`);
  // only for local dev
  // await oracle.updateWhitelist((await ethers.getSigners())[0].address, true)

  return oracle.target as string;
}

async function deployChatGpt(contractName: string, oracleAddress: string) {
  const agent = await ethers.deployContract(contractName, [oracleAddress], {});

  await agent.waitForDeployment();

  console.log(`${contractName} deployed to ${agent.target}`);
}

async function deployChatGptWithKnowledgeBase(contractName: string, oracleAddress: string, knowledgeBaseCID: string) {
  const agent = await ethers.deployContract(contractName, [oracleAddress, knowledgeBaseCID], {});

  await agent.waitForDeployment();

  console.log(`${contractName} deployed to ${agent.target} with knowledge base "${knowledgeBaseCID}"`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
