import lighthouse from "@lighthouse-web3/sdk";

const apiKey = process.env.FILECOIN_KEY;

// function to uploadText
export const uploadText = async (text: string) => {
  if (!apiKey) {
    throw new Error("No API key found");
  }
  try {
    return await lighthouse.uploadText(text, apiKey);
  } catch (error) {
    console.error(error);
  }
};

export const getFileUrl = (hashOrCid: string) => {
  return `https://gateway.lighthouse.storage/ipfs/${hashOrCid}`;
};
