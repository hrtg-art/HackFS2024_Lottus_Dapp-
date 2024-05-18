import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Despliega el contrato LottusNFT
  const lottusNFTDeployment = await deploy("LottusNFT", {
    from: deployer,
    args: ["LottusNFT", "LNFT"],
    log: true,
    autoMine: true,
  });

  console.log("LottusNFT deployed to:", lottusNFTDeployment.address);

  // Despliega el contrato LottusLottery y pasa la dirección de LottusNFT al constructor
  const ownerAddress = "0x2f2ccC1a96E56Ae8F74CE7Fd1b97A7B5596BA1Ae";
  const lottusLotteryDeployment = await deploy("LottusLottery", {
    from: deployer,
    args: [ownerAddress, lottusNFTDeployment.address],
    log: true,
    autoMine: true,
  });

  console.log("LottusLottery deployed to:", lottusLotteryDeployment.address);
};

export default deployContracts;
deployContracts.tags = ["LottusNFT", "LottusLottery"];
