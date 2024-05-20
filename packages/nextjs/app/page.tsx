"use client";

import React, { useState } from "react";
import Image from "next/image";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import Countdown from "~~/components/Countdown";
import CounterComponent from "~~/components/CounterComponent";
import UserBadges from "~~/components/UserBadges";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [quantity, setQuantity] = useState(1);
  const { address: connectedAddress } = useAccount();

  // Reading Functions From Lottus SmartContract
  const { data: price1 } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "getPrizePool",
  });

  const { data: PrizeAmount } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "lastPrizeAmount",
  });

  const { data: CurrentLottus } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "currentLottery",
  });

  const { data: LastWinner } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "getWinner",
  });

  // Read user level and badges

  const { data: userBadges } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "getUserBadges",
    args: [connectedAddress],
  });

  const [, , , Banner] = CurrentLottus || [];
  const [, , , , Winner] = CurrentLottus || [];
  const [, , , , , Participant] = CurrentLottus || [];
  const [, , , , , , ethValue] = CurrentLottus || [];
  const [, LottusName, ,] = CurrentLottus || [];
  const [LottusNumber, , ,] = CurrentLottus || [];
  const [, , LottusDesc] = CurrentLottus || [];
  const [, , , , , , , Charity] = CurrentLottus || [];
  const isActive = CurrentLottus ? CurrentLottus[10] : false;

  const ethValueNumber = ethValue ? Number(BigInt(ethValue.toString())) : 0;

  const { data: TicketsSold } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "getParticipants",
  });

  const numberOfParticipants = TicketsSold ? TicketsSold.length : 0;
  const uniqueParticipants = TicketsSold ? new Set(TicketsSold).size : 0;
  const ticketsOwned = TicketsSold ? TicketsSold.filter((address: string) => address === connectedAddress).length : 0;

  // Writing to Lottus Smart Contract
  const { writeContractAsync: buyTicket } = useScaffoldWriteContract("LottusLottery");

  const handleBuyTickets = async () => {
    if (quantity > 0 && ethValue !== undefined) {
      const totalValue = ethValue * BigInt(quantity); // Total value en wei
      try {
        await buyTicket({
          functionName: "buyTicket",
          args: [BigInt(quantity)],
          value: totalValue,
        });
      } catch (e) {
        console.error("Error buying tickets:", e);
      }
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-20">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-8xl font-bold">Lottus</span>
            <span className="block text-1xl mb-4">
              The Help 2 Earn System Where you can get rewarded by being a good soul...
            </span>
          </h1>
          <div className="flex flex-col w-full">
            <div className="grid place-items-center">
              <div className="h-[400px] w-[1500px] card bg-base-300 rounded-box place-items-center overflow-hidden">
                {Banner ? (
                  <Image src={`https://ipfs.io/ipfs/${Banner}`} alt="Lottus Banner" layout="fill" objectFit="cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">No banner available</span>
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-center p-5">
              <span className="stat-value p-2">
                Lottus N.{LottusNumber?.toString()}: {LottusName?.toString()}
              </span>
            </h1>

            <div className="flex justify-center">
              <span className="block text-1xl mb-10 w-[900px] text-center">{LottusDesc?.toString()}</span>
            </div>

            <div className="flex flex-col items-center pt-5 pb-10 space-y-10">
              <div className="flex justify-center items-center pt-5 pb-10 space-x-32">
                {/* Columna 1 */}
                <div className="flex-2">
                  <div className="indicator">
                    <div className="indicator-item indicator-bottom"></div>
                    <div className="stat-actions flex flex-col space-y-2 px-4">
                      <CounterComponent ethValue={ethValueNumber / 1e18} onQuantityChange={setQuantity} />
                      <div className="flex justify-center p-5">
                        <button className="btn btn-primary" onClick={handleBuyTickets} disabled={!isActive}>
                          {isActive ? "Buy Tickets" : "This Lottus has Ended"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna 2 */}
                <div className="flex-1">
                  {isActive ? (
                    <div className="p-5">
                      <div className="stat-value p-2 text-center">You Have:</div>
                      <span className="block text-8xl font-bold text-center">{ticketsOwned}</span>
                      <div className="stat-value p-2 text-center">Tickets For This Lottus</div>
                    </div>
                  ) : (
                    <div className="p-5 text-center">
                      {ticketsOwned > 0 ? (
                        connectedAddress === LastWinner ? (
                          <div>
                            <div className="stat-value p-2">Congratulations!</div>
                            <div className="text-xl">You were the winner of this Lottus.</div>
                            <div className="text-xl">Not only that, you helped a charity receive:</div>
                            <div className="stat-value pt-3 pb-5">
                              {PrizeAmount ? Number(BigInt(PrizeAmount.toString())) / 1e18 : 0} ETH
                            </div>
                            <div className="text-xl">Check your wallet for the Winner NFT for being</div>
                            <div className="text-xl">A good soul with good luck</div>
                          </div>
                        ) : (
                          <div>
                            <div className="stat-value p-2">You are still a hero!,</div>
                            <div className="text-xl">Sadly you did not win this time</div>
                            <div className="text-xl">but you still helped a charity receive:</div>
                            <div className="stat-value pt-3 pb-5">
                              {PrizeAmount ? Number(BigInt(PrizeAmount.toString())) / 1e18 : 0} ETH
                            </div>
                            <button className="btn btn-primary px-10">Claim The proof that you are a good soul</button>
                          </div>
                        )
                      ) : (
                        <div>
                          <div className="stat-value p-2">This Lottus has ended.</div>
                          <div className="text-xl">We raised:</div>
                          <div className="stat-value pt-3 pb-5">
                            {PrizeAmount ? Number(BigInt(PrizeAmount.toString())) / 1e18 : 0} ETH for charity
                          </div>
                          <div className="text-xl">But do not worry</div>
                          <div className="text-xl">A new Lottus will be launching soon, do not miss it!</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <UserBadges badges={userBadges || []} />
            </div>

            <div className="divider divider-success pt-10"></div>

            <div className="stats shadow ">
              <div style={{ display: "flex", alignItems: "center", padding: 10 }}>
                {isActive ? (
                  <>
                    <span className="loading loading-infinity loading-lg loading-lg-custom"></span>
                    <span className="stat-value p-2">Active</span>
                  </>
                ) : (
                  <span className="stat-value p-2">Ended</span>
                )}
              </div>

              {isActive ? (
                <div className="flex justify-center p-10">
                  <Countdown />
                </div>
              ) : (
                <div className="p-5">
                  <div className="stat-title pb-3">Lottus Winner</div>
                  <Address address={LastWinner} />
                </div>
              )}

              {isActive ? (
                <div className="p-5">
                  <div className="stat-title pb-3">Charity:</div>
                  <Address address={Charity} />
                </div>
              ) : (
                <div className="p-5">
                  <div className="stat-title pb-3">Charity:</div>
                  <Address address={Charity} />
                </div>
              )}

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Price Per Ticket</div>
                <div className="stat-value">{ethValue ? Number(BigInt(ethValue.toString())) / 1e18 : 0} ETH</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Tickets Sold:</div>
                <div className="stat-value text-center">{numberOfParticipants}</div>
                <div className="stat-desc">Total of participants: {uniqueParticipants}</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Current Prize Pool</div>
                <div className="stat-value">{price1 ? Number(BigInt(price1.toString())) / 1e18 : 0} ETH*</div>
                <div className="stat-desc">*40% of the total</div>
              </div>
            </div>

            <div className="divider divider-success"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-5 pt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Columna 1: Ganadores Recientes y Donaciones Recientes */}
          <div className="overflow-x-auto p-5 bg-base-300 shadow-lg rounded-box">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Recent Winners</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Ganador 1</td>
                </tr>
                <tr>
                  <th>2</th>
                  <td>Ganador 2</td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Ganador 3</td>
                </tr>
              </tbody>
            </table>

            <table className="table w-full mt-5">
              <thead>
                <tr>
                  <th></th>
                  <th>Recent Donations</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Donación 1</td>
                </tr>
                <tr>
                  <th>2</th>
                  <td>Donación 2</td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Donación 3</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Columna 2: Suggest the Next Charity */}
          <div className="p-5 bg-base-300 shadow-lg rounded-box">
            <h2 className="stat-value p-1 text-center">Suggest the Next Charity</h2>
            <p className="mt-3 p-5 text-center">
              You can suggest the next charity organization to donate to here. Share your suggestions and help decide
              the next cause to support.
            </p>
            <div className="flex justify-center mt-3">
              <button className="btn btn-primary px-10">Fill the Form</button>
            </div>
          </div>

          {/* Columna 3: NFT Awards & Certificates */}
          <div className="p-5 bg-base-300 shadow-lg rounded-box">
            <h2 className="stat-value p-1 text-center">NFT Awards & Certificates</h2>
            <div className="flex justify-center mt-3 space-x-10">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">Winner NFT</h3>
                <div className="w-40 h-40 bg-gray-300 flex items-center justify-center overflow-hidden rounded-box relative">
                  {Winner ? (
                    <Image src={`https://ipfs.io/ipfs/${Winner}`} alt="Winner NFT" layout="fill" objectFit="cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">No Winner NFT available</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">Participant NFT</h3>
                <div className="w-40 h-40 bg-gray-300 flex items-center justify-center overflow-hidden rounded-box relative">
                  {Participant ? (
                    <Image
                      src={`https://ipfs.io/ipfs/${Participant}`}
                      alt="Participant NFT"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">No Participant NFT available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="mt-3 text-center">
              There may be more prizes depending on collaborations with other dApps or protocols.
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-center pt-20">
        <span className="stat-value p-2">F.A.Q</span>
      </h1>
      <div className="flex items-center flex-col flex-grow pt-5">
        <div className="w-[1500px] px-5 space-y-4">
          <div className="collapse bg-base-200 w-full">
            <input type="checkbox" className="peer" />
            <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content stat-value p-5">
              What is Lottus and how does it work?
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              <p>
                Lottus is a decentralized donation platform that operates like a lottery. Each week, a new charity is
                selected to receive 40% of the donation pool, while another 40% goes to the raffle winner. The remaining
                20% is allocated in the following way, 10% for the dev and 10% stays in the contract for the next
                Lottus. The winner receives a prize in cryptocurrency and a commemorative NFT, while all participants
                receive a participation NFT.
              </p>
            </div>
          </div>

          <div className="collapse bg-base-200 w-full">
            <input type="checkbox" className="peer" />
            <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content stat-value p-5">
              How can I participate in a Lottus lottery?
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              <p>
                To participate in a Lottus lottery, simply select the number of tickets you want to purchase and
                complete the transaction through your wallet. Our smart contract will handle the rest. You can view the
                total prize pool before finalizing your transaction to ensure that your donation does not exceed the
                current prize pool, avoiding the risk of receiving less than you donated. Once your transaction is
                confirmed, you will be automatically entered into the raffle for the current week.
              </p>
            </div>
          </div>

          <div className="collapse bg-base-200 w-full">
            <input type="checkbox" className="peer" />
            <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content stat-value p-5">
              How is the raffle winner selected and how is fairness ensured?
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              <p>
                The raffle winner is selected using Chainlink VRF Verifiable Random Function, which ensures that the
                selection process is truly random and transparent. This technology provides a provably fair and
                tamper-proof source of randomness, ensuring the integrity of the raffle.
              </p>
            </div>
          </div>

          <div className="collapse bg-base-200 w-full">
            <input type="checkbox" className="peer" />
            <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content stat-value p-5">
              What are the NFTs?
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              <p>
                Lottus issues two types of NFTs: Winner NFTs and Participation NFTs. Winner NFTs are awarded to the
                weekly raffle winner and commemorate their victory. Participation NFTs are given to all participants as
                a token of appreciation for their contribution. Both types of NFTs are personalized with the recipients
                wallet address or ENS name, and their metadata is securely stored on IPFS and backed up on Filecoin.
              </p>
            </div>
          </div>

          {/* Add more collapse items as needed */}
        </div>
      </div>
    </>
  );
};

export default Home;
