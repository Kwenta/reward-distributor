import dotenv from "dotenv";
dotenv.config();

const config = {
  mainnet: {
    rpcUrl: `https://optimism.infura.io/v3/${process.env.INFURA_API_KEY}`,
    escrowDistributorAddress: "", // TODO: Set mainnet address once deployed
    kwentaTokenAddress: "", // TODO: Set mainnet address once deployed
  },
  testnet: {
    rpcUrl: `https://optimism-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,

    escrowDistributorAddress: "0x6Bb9Fa4c8Af447fF7c7Be8D635781386A1BD6A62",
    kwentaTokenAddress: "0xDA0C33402Fc1e10d18c532F0Ed9c1A6c5C9e386C",
  },
};

export default config;
