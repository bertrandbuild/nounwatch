import { ABI } from "../abis/abi";
import { BigNumber, Contract, Wallet, getDefaultProvider } from "ethers";

export interface GptQuery {
  content: string;
  role: GptRole;
  transactionHash?: string;
}
export type GptRole = "assistant" | "user" | "system";

function getId(receipt, contract: Contract) {
  let id;
  for (const log of receipt.logs) {
    try {
      console.log(contract);
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog && parsedLog.name === "ChatCreated") {
        // Second event argument
        // id = ethers.toNumber(parsedLog.args[1])
        id = BigNumber.from(parsedLog.args[1]).toNumber();
      }
    } catch (error) {
      // This log might not have been from your contract, or it might be an anonymous log
      console.log("Could not parse log:", log);
    }
  }
  return id;
}

async function getCallbackFromGaladriel(contract: Contract, id: number, currentCount: number): Promise<any[]> {
  const queryHistory = await contract.getMessageHistoryContents(id);
  const roles = await contract.getMessageHistoryRoles(id);

  const newInsights: GptQuery[] = [];
  queryHistory.forEach((message: any, i: number) => {
    if (i >= currentCount) {
      newInsights.push({
        role: roles[i],
        content: queryHistory[i],
      });
    }
  });
  return newInsights;
}

const getPrompt = (transcript: string) => {
  // The custom GPT prompt
  let prompt = `Title: YouTube Video Transcript.`;
  prompt += `Analysis: Financial Market Insights and Psychological Recommendations.
    Objective: Analyze the provided transcript of a YouTube video focusing on finance.
    The video content may vary, encompassing structured market news, technical analysis, and/or market psychology recommendations.
    Additionally, evaluate the overall sentiment conveyed in the video to determine a "Fear and Greed Indicator" score.
  `;
  prompt += `Instructions: Read through the transcript carefully.
  Identify and differentiate between sections focused on market news and technical analysis.
  Summarize the key points as follows: Market News: Briefly list any major financial news items discussed, including relevant companies, economic indicators, or global events (3 to 5 bullet points). 
  Technical Analysis: Extract and list specific details mentioned, such as: Price targets for identified assets or securities. Support and resistance levels. Any mentioned technical indicators (e.g., moving averages, RSI levels), (3 to 5 bullet points).
  `;
  // For each key point, define the impact of the event between : "very bearish", "bearish", "neutral", "bullish", "very bullish".
  prompt += `Determine the Fear and Greed Indicator: Review the overall tone and content of the video.
  Assign a score from 0 (maximum fear) to 100 (maximum greed) based on the sentiment analysis of the video content.
  Consider the following factors: The urgency and tone in discussions of market news and events.
  The optimism or caution expressed in technical analysis. Recommendations that suggest fear or greed in market psychology.`;
  prompt += `Output Format: Provide your analysis in bullet points, clearly categorized under "Market_News", "Technical_Analysis" and conclude with the "Fear_and_Greed_Indicator" score.`;
  prompt += `Output Format: use a json format, reply in the language of the transcript, with only the json.`;
  prompt += `Example Output: Market News: Discussed the recent Fed rate hike and its impact on tech stocks. Highlighted the earnings surprise from Company X, leading to a sharp stock price increase. Technical Analysis: Price target for Stock Y is set at $150, with current resistance at $145. Support for Currency Pair Z identified at 1.2500, with potential upside to 1.2650. Fear and Greed Indicator: 65 The score reflects moderate greed, influenced by optimistic price targets and positive market news coverage, balanced by cautionary advice on investment behavior.`;
  prompt += `Transcript: ${transcript}`;
  return prompt;
};

export async function getSummarizedTranscript(transcript: string) {
  const contractAddress = process.env.NEXT_PUBLIC_GPT_CONTRACT_ADDRESS;
  // const [signer] = await ethers.getSigners(); 
  // TODO: update to handle signing in backend to secure key
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY_LOCALHOST;
  console.log("Using private key:", privateKey);
  const wallet = new Wallet(privateKey);
  const provider = getDefaultProvider(process.env.NEXT_PUBLIC_INFURA_URL + process.env.NEXT_PUBLIC_INFURA_ID);
  const signer = wallet.connect(provider);
  console.log("Connected to wallet");
  console.log(privateKey, contractAddress, signer, provider);

  const contract = new Contract(contractAddress, ABI, signer);
  console.log(contract);

  const prompt = getPrompt(transcript);
  console.log(prompt);

  // Call the startGpt function
  const transactionResponse = await contract.startGpt(prompt);
  const receipt = await transactionResponse.wait();

  // Get the ID from transaction receipt logs
  let id = getId(receipt, contract);
  if (!id && id !== 0) {
    console.error("Could not get ID");
    return;
  }

  if (receipt && receipt.status) {
    if (id) {
      while (true) {
        const newInsights: GptQuery[] = await getCallbackFromGaladriel(contract, id, 1);
        if (newInsights) {
          const lastMessage = newInsights.at(-1);
          if (lastMessage && lastMessage.role == "assistant") {
            return lastMessage.content;
          }
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
}
