"use client";

// import {
//   ConnectWallet,
//   ThirdwebProvider,
//   coinbaseWallet,
//   embeddedWallet,
//   en,
//   metamaskWallet,
//   walletConnect,
// } from "@thirdweb-dev/react";

// export default function ThirdwebWallet() {
//   return (
//     <ThirdwebProvider
//       activeChain="mumbai"
//       clientId="48376d20eb92cb4220f1d7e403430ee0"
//       locale={en()}
//       supportedWallets={[
//         metamaskWallet(),
//         coinbaseWallet(),
//         walletConnect(),
//         embeddedWallet({
//           auth: {
//             options: ["email", "google", "facebook"],
//           },
//         }),
//       ]}
//     >
//       <ConnectWallet theme={"dark"} modalSize={"compact"} />
//     </ThirdwebProvider>
//   );
// }


import {
    ThirdwebProvider,
    ConnectWallet,
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
    localWallet,
    embeddedWallet,
    trustWallet,
    frameWallet,
    rainbowWallet,
    phantomWallet,
    en
  } from "@thirdweb-dev/react";
  
  export default function App() {
    return (
      <ThirdwebProvider
        activeChain="sepolia"
        clientId="YOUR_CLIENT_ID"
        locale={en()}
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet({ recommended: true }),
          walletConnect(),
          localWallet(),
          embeddedWallet({
            auth: {
              options: [
                "email",
                "google",
                "facebook",
              ],
            },
          }),
          trustWallet(),
          frameWallet(),
          rainbowWallet(),
          phantomWallet(),
        ]}
      >
        <ConnectWallet
          theme={"light"}
          modalSize={"wide"}
        />
      </ThirdwebProvider>
    );
  }
  