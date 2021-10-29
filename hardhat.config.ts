import "@nomiclabs/hardhat-waffle";
import dotenv from "dotenv";

dotenv.config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
    solidity: "0.8.7",
    paths: {
        sources: "./tests/contracts",
        tests: "./tests",
    },
};
