import { wei } from "@synthetixio/wei";
import { BigNumber, ethers } from "ethers";
import dotenv from "dotenv";
import { parse } from "csv-parse";
import fs from "fs";
import prompts from "prompts";

import EscrowDistributorABI from "./abis/EscrowDistributor.json";
import config from "./config";
import ERC20ABI from "./abis/ERC20.json";

dotenv.config();

const argv = require("minimist")(process.argv.slice(2));
let network: "mainnet" | "mainnet-fork" | "testnet" | undefined = argv.network;

if (network !== "mainnet" && network !== "mainnet-fork" && network !== "testnet")
  throw new Error('Please specify "mainnet" or "testnet" network');

const rpcUrl = config[network].rpcUrl;
const escrowDistributorAddress = config[network].escrowDistributorAddress;
const kwentaAddress = config[network].kwentaTokenAddress;

const SLICE_LENGTH = 50;
const DURATION_WEEKS = 52;

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(process.env.DISTRIBUTION_WALLET ?? "");
const signer = wallet.connect(provider);

type DistributionData = Record<string, string>;

const escrowDistributor = new ethers.Contract(
  escrowDistributorAddress,
  EscrowDistributorABI,
  signer
);

const kwentaToken = new ethers.Contract(kwentaAddress, ERC20ABI, signer);

const distribute = async (accounts: string[], amounts: string[]) => {
  const total = amounts.reduce((acc, a) => acc.add(a), BigNumber.from(0));
  console.log("Total KWENTA: ", wei(total).toString());
  console.log(`Escrow Duration: ${DURATION_WEEKS} weeks`);
  console.log(`Network: ${network}`);

  const response = await prompts({
    type: "confirm",
    name: "value",
    message: "Confirm airdrop?",
  });

  if (!response.value) {
    process.exit();
  }

  let tx = await kwentaToken.approve(escrowDistributorAddress, total);
  await tx.wait();
  console.log("Approving Kwenta to escrow: ", wei(total).toString());
  console.log("✅ Approval complete");
  for (let i = 0; i < accounts.length; i += SLICE_LENGTH) {
    console.log(
      "\nAccount: ",
      accounts.slice(i, i + SLICE_LENGTH),
      "KWENTA",
      amounts.slice(i, i + SLICE_LENGTH),
      "\n"
    );

    const accountsSlice = accounts.slice(i, i + SLICE_LENGTH);
    const amountsSlice = amounts
      .slice(i, i + SLICE_LENGTH)
      .map((a) => BigNumber.from(a));

    tx = await escrowDistributor.distributeEscrowed(
      accountsSlice,
      amountsSlice,
      BigNumber.from(DURATION_WEEKS)
    );
    await tx.wait();
    console.log(
      `Transaction complete: ${tx.hash}: ${i} to ${i + amountsSlice.length}`
    );
  }
};

const extractCsvData = async () => {
  var distroData: DistributionData = {};
  return new Promise<DistributionData>((res, rej) => {
    fs.createReadStream("./escrowRecipients.csv")
      .pipe(parse({ delimiter: ":" }))
      .on("data", async (csvrow: [string, string | undefined]) => {
        const items = csvrow[0].split(",");
        const address = items[0];
        const amount = items[1] || "0";
        if (distroData[address]) {
          console.warn("** Duplicate", address);
          distroData[address] = String(
            Number(distroData[address]) + Number(amount)
          );
        } else {
          distroData[address] = amount;
        }
      })
      .on("end", function () {
        res(distroData);
      });
  });
};

async function distributeFromCsv() {
  const data = await extractCsvData();
  await distribute(Object.keys(data), Object.values(data));
  console.log("✅ Distribution complete!");
}

distributeFromCsv();
