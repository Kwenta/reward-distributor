import { wei } from "@synthetixio/wei";
import { ethers } from "ethers";
import { REWARD_RECIPIENTS } from "./distributions";
import { distributor, gasEstimator } from "./distributor";

//Optimistic Mainnet SNX
const SNX = "0x8700daec35af8ff88c16bdf0418774cb3d7599b4";
const SNX_AMOUNT = "5034.645327585582269872";

const main = async () => {
    console.log("Distribution Initializing...");
    // Note* Will not work with current optimism gas logic
    /*console.log(
        "Estimated gas cost: ",
        await gasEstimator(
            SNX,
            REWARD_RECIPIENTS,
            new ethers.providers.JsonRpcProvider("https://mainnet.optimism.io"),
            "0xf43f2416f41b0b58086ff06040115b9522dfbe8c"
        )
    );*/
    await distributor(SNX, wei(SNX_AMOUNT), REWARD_RECIPIENTS);
    console.log("Rewards Distributed!");
};

main();
