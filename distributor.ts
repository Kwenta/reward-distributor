import Wei, { wei } from "@synthetixio/wei";
import { ethers } from "ethers";
import dotenv from "dotenv";

import { ABI as ERC20ABI } from "./ERC20.ABI";
import { Distribution } from "./types";

dotenv.config();

const setup = (_provider?: ethers.providers.Provider) => {
    const provider = _provider ?? new ethers.providers.JsonRpcProvider();
    const wallet = new ethers.Wallet(process.env.DISTRIBUTION_WALLET ?? "");
    const signer = wallet.connect(provider);
    return [provider, signer];
};

export const gasEstimator = async (
    reward: string,
    distributions: Distribution[],
    provider: ethers.providers.Provider,
    from?: string
) => {
    const [, signer] = setup(provider);
    const ERC20 = new ethers.Contract(
        reward,
        ERC20ABI,
        from ? provider : signer
    );
    const cost = await ERC20.estimateGas.transfer(
        distributions[0].recipientAddress,
        ethers.constants.One,
        {
            from: from,
        }
    );
    return wei(ethers.utils.formatEther(cost))
        .mul(distributions.length)
        .toString();
};

export const distributor = async (
    reward: string,
    amount: Wei,
    distributions: Distribution[],
    provider?: ethers.providers.Provider
) => {
    const [, signer] = setup(provider);
    let receipts = [];
    for (const distribution of distributions) {
        const ERC20 = new ethers.Contract(reward, ERC20ABI, signer);
        const tx = await ERC20.transfer(
            distribution.recipientAddress,
            amount.mul(distribution.rewardPercentage).toBN()
        );
        receipts.push(await tx.wait());
        console.log(`Rewards sent to: ${distribution.recipientAddress}`);
    }
    return receipts;
};
