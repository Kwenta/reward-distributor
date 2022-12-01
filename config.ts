import dotenv from "dotenv";
dotenv.config();

const config = {
  mainnet: {
    rpcUrl: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    escrowDistributorAddress: "0x036EA1D01e007afA69a9Df5dbA8D86C0344F7c4D",
    kwentaTokenAddress: "0x920Cf626a271321C151D027030D5d08aF699456b",
  },
  "mainnet-fork": {
    rpcUrl: `http://127.0.0.1:8545/`,
    escrowDistributorAddress: "0x036EA1D01e007afA69a9Df5dbA8D86C0344F7c4D",
    kwentaTokenAddress: "0x920Cf626a271321C151D027030D5d08aF699456b",
  },
  testnet: {
    rpcUrl: `https://optimism-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    escrowDistributorAddress: "0x6Bb9Fa4c8Af447fF7c7Be8D635781386A1BD6A62",
    kwentaTokenAddress: "0xDA0C33402Fc1e10d18c532F0Ed9c1A6c5C9e386C",
  },
};

export default config;
