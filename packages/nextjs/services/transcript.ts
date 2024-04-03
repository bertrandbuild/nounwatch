import { URL_TRANSCRIPT_API } from "~~/utils/constants";

function extractVideoId(input: string) {
  // Check if input is directly a video ID (assuming video IDs are 11 characters long and do not contain special URL characters)
  if (input.length === 11 && !input.includes("/") && !input.includes("?") && !input.includes("&")) {
    return input;
  }

  // Attempt to handle the input as a URL
  try {
    const url = new URL(input.startsWith("http://") || input.startsWith("https://") ? input : `https://${input}`);
    const urlParams = new URLSearchParams(url.search);
    const videoId = urlParams.get("v");

    if (videoId) {
      return videoId;
    }

    // In some cases, the video ID might be part of the pathname for certain URL formats, e.g., "https://youtu.be/Dwb4u8my4vg"
    const pathSegments = url.pathname.split("/").filter(Boolean); // Remove any empty strings due to leading or trailing slashes
    if (pathSegments.length && pathSegments[0].length === 11) {
      return pathSegments[0];
    }
  } catch (error) {
    console.error("Error parsing input:", error);
  }

  return null; // Return null if the video ID couldn't be determined
}

function getTranscript(videoId: string) {
  const endpoint = `${URL_TRANSCRIPT_API}/get_transcript?videoId=${videoId}`;
  return fetch(endpoint)
    .then(async response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const text = await response.text();
      return text;
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error("There was a problem with your fetch operation:", error);
      throw error;
    });
}

function getSummarizedTranscript(transcript: string) {
  // Return hardcoded data for now
  return {
    Market_News: [
      "Bitcoin is down 3.94%",
      "Bitcoin is in a bullish trend as long as it doesn't close a week below 58k",
      "Bitcoin's scenario of pumping past 70k and not revisiting it did not materialize; instead, a more sideways scenario is present with Bitcoin stuck at around 69-70k",
      "Discussion of historical patterns suggesting current market dynamics are not unusual",
      "Reference to major dumps and recoveries, highlighting the volatile nature of the market",
    ],
    Technical_Analysis: [
      "Bullish as long as Bitcoin stays above 58k",
      "Bitcoin is currently stuck at around 69-70k, facing resistance at these levels",
      "A flag formation target for Bitcoin was met, indicating a potential sideways movement for the week",
      "Long term target for Bitcoin is around 90k based on doubling the price from the last base of 45k",
    ],
    Fear_and_Greed_Indicator: 85,
  };
  // TODO: CALL AI
  // const endpoint = `http://localhost:3000/api/get_summarized_ai`;
  // return fetch(endpoint, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ transcript: transcript }),
  // })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     data = extractAndParseJSON(data.summarizedTranscript);
  //     return data;
  //   })
  //   .catch(error => {
  //     console.error("There was a problem with your fetch operation:", error);
  //     throw error;
  //   });
}

export { getTranscript, extractVideoId, getSummarizedTranscript };
