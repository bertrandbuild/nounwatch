"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { getFileUrl, uploadText } from "~~/services/filecoin";
import { getSummarizedTranscript } from "~~/services/galadriel";
import { extractVideoId, getTranscript } from "~~/services/transcript";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [content, setContent] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSubmit = async (videoUrl: string) => {
    setIsLoading(true);
    const videoId = extractVideoId(videoUrl);
    if (!videoUrl || !videoUrl.length || !videoId) {
      setIsLoading(false);
      console.error("Invalid video URL");
      // TODO: handle error nicely for the user
      return;
    }
    if (videoId) {
      try {
        const isDev = false;
        if (isDev) {
          setIsLoading(true);
          const aiInsights = await getSummarizedTranscript("");
          console.log(aiInsights);
          window.setTimeout(() => {
            setContent(aiInsights);
            setIsLoading(false);
            setIsLoaded(true);
          }, 4000);
        } else {
          const transcript = await getTranscript(videoId);
          console.log(transcript);
          const aiInsights: any = await getSummarizedTranscript(transcript);
          console.log(aiInsights);
          const transcriptCid = await uploadText(JSON.stringify(transcript));
          const aiInsightsCid = await uploadText(JSON.stringify(aiInsights));
          window.setTimeout(() => {
            const content = {
              ...aiInsights, // TODO: add ai insights (only for dev)
              analyzisFileUrl: getFileUrl(aiInsightsCid?.data.Hash),
              transcriptFileUrl: getFileUrl(transcriptCid?.data.Hash),
            };
            setContent(content);
            setIsLoading(false);
            setIsLoaded(true);
          }, 100);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Enter a YouTube video URL to get started{" "}
            <form
              onSubmit={event => {
                event.preventDefault(); // Prevent the default form submission behavior
                const formData = new FormData(event.currentTarget);
                const url = formData.get("videoUrl");
                handleSubmit(url?.toString() || "");
              }}
            >
              <input type="text" name="videoUrl" className="input input-bordered" />
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
            {isLoading && <span className="loading loading-spinner loading-lg"></span>}
            {isLoaded && <span>Loaded!</span>}
            {content && (
              <>
                <p className="mt-4">Transcript:</p>
                <p className="text-lg">{content.transcript}</p>
              </>
            )}
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
