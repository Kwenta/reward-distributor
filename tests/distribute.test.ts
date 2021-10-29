import { wei } from "@synthetixio/wei";
import { expect } from "chai";
import { Wallet, Contract } from "ethers";
import { ethers } from "hardhat";
import { REWARD_RECIPIENTS } from "../distributions";
import { distributor } from "../distributor";

const REWARD_AMOUNT = "5034.645327585582269872";

describe("Distributooor", function () {
    let distributionWallet: Wallet, mock: Contract;

    before(async () => {
        distributionWallet = new ethers.Wallet(
            process.env.DISTRIBUTION_WALLET ?? ""
        ).connect(ethers.provider);

        const ERC20 = await ethers.getContractFactory("ERC20");
        mock = await ERC20.deploy(
            "Mock",
            "MCK",
            distributionWallet.address,
            wei(REWARD_AMOUNT).toBN()
        );
        const [wallet1] = await ethers.getSigners();

        await mock.deployed();
        expect(await mock.symbol()).to.equal("MCK");

        //Top up distributor
        wallet1.sendTransaction({
            to: distributionWallet.address,
            value: wei(1).toBN(),
        });

        //Distribute
        await distributor(
            mock.address,
            wei(REWARD_AMOUNT),
            REWARD_RECIPIENTS,
            ethers.provider
        );
    });

    it("Expect first recipient to receive distribution", async function () {
        await expect(
            await mock.balanceOf(REWARD_RECIPIENTS[0].recipientAddress)
        ).to.equal(
            wei(REWARD_AMOUNT).mul(REWARD_RECIPIENTS[0].rewardPercentage).toBN()
        );
    });

    it("Expect last recipient to receive distribution", async function () {
        await expect(
            await mock.balanceOf(
                REWARD_RECIPIENTS[REWARD_RECIPIENTS.length - 1].recipientAddress
            )
        ).to.equal(
            wei(REWARD_AMOUNT)
                .mul(
                    REWARD_RECIPIENTS[REWARD_RECIPIENTS.length - 1]
                        .rewardPercentage
                )
                .toBN()
        );
    });

    it("Expect most of the token to be distributed", async function () {
        // Because @synthetixio/wei .mul rounds down (like solidity) we expect some dust
        await expect(
            await mock.balanceOf(REWARD_RECIPIENTS[0].recipientAddress)
        ).to.be.closeTo(
            wei(REWARD_AMOUNT)
                .mul(REWARD_RECIPIENTS[0].rewardPercentage)
                .toBN(),
            10
        );
    });
});
