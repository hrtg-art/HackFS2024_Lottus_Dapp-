import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployLottusContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const ownerAddress = "0xbbe43612b9B577d5d9cB786324880c01d5792Ebc";

  // Despliega el contrato LottusLottery
  const lottusLotteryDeployment = await deploy("LottusLottery", {
    from: deployer,
    args: [ownerAddress],
    log: true,
    autoMine: true,
  });

  console.log("LottusLottery deployed to:", lottusLotteryDeployment.address);

  // Despliega el contrato LottusNFT y pasa la dirección de LottusLottery al constructor
  const initialWinnerCID = "Qm..."; // Reemplaza con el CID inicial para el ganador
  const initialParticipantCID = "Qm..."; // Reemplaza con el CID inicial para los participantes

  const lottusNFTDeployment = await deploy("LottusNFT", {
    from: deployer,
    args: ["LottusNFT", "LNFT", lottusLotteryDeployment.address, initialWinnerCID, initialParticipantCID],
    log: true,
    autoMine: true,
  });

  console.log("LottusNFT deployed to:", lottusNFTDeployment.address);

  const lottusNFTContract = await ethers.getContractAt("LottusNFT", lottusNFTDeployment.address);
  await lottusNFTContract.transferOwnership(ownerAddress);
};

export default deployLottusContracts;
deployLottusContracts.tags = ["LottusContracts"];
