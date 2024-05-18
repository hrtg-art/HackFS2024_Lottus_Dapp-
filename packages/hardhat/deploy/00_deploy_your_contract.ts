import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployLottusLottery: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const ownerAddress = "0x2f2ccC1a96E56Ae8F74CE7Fd1b97A7B5596BA1Ae";

  await deploy("LottusLottery", {
    from: deployer,
    args: [ownerAddress],
    log: true,
    autoMine: true,
  });

  const lottusLottery = await hre.ethers.getContract<Contract>("LottusLottery", deployer);
  console.log("LottusLottery deployed to:", lottusLottery.address);
};

export default deployLottusLottery;
deployLottusLottery.tags = ["LottusLottery"];
