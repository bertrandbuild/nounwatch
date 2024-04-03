# ⌐◨-◨  Nounwatch ⌐◨-◨

On-chain data aggregator that turns long youtube videos of crypto influencers into AI summarized insights quick to read & visualize.

**[View demo](https://ethglobal.com/showcase/nounwatch-vz83z)**

🧪 Tech stack

- AI : GaladrielAI L1 oracle
- Frontend :  Scaffoldeth / NextJS / Wagmi / Viem / RainbowKit
- Chain : Hardhat
- Storage : Filecoin / Lighthouse
- Typescript
- Design : Nouns

## Features

- Query one video and get analysis
- Display a fear&greed index + key fundamental & technical analysis
- Using testnets

## In progress

- [x] New frontend code
- [x] New offchain computation to get transcript (remote python aws)
  - [example url](https://3k1x93u5kg.execute-api.eu-west-1.amazonaws.com/api/get_transcript?videoId=adaZ2nN2NEw)
- [ ] Update Galadriel to new devnet and new contracts
- [ ] Implement most of the logic in a smart contract
- [ ] Implement Tableland
- [ ] Deploy on Fleek
- [ ] Add video feed with credit plan

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started, follow the steps below:

1. install dependencies

```
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`

## Documentation

Visit [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out [website](https://scaffoldeth.io).
