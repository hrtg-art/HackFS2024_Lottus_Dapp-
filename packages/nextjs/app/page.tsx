"use client";

import React, { useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import Example from "~~/components/Banner";
import Countdown from "~~/components/Countdown";
import CounterComponent from "~~/components/CounterComponent";
import FilecoinComponent from "~~/components/FilecoinComponent";
import PostLottusRoom from "~~/components/PostLottusVoiceRoom";
import SquidWidgetIframe from "~~/components/SquidWidgetIframe";
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

  const { data: winnerRecords } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "getWinnerRecords",
  });

  const { data: CharityRecords } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "getCharityRecords",
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
  const isActive = CurrentLottus ? CurrentLottus[9] : false;

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

  const { writeContractAsync: claimNFT } = useScaffoldWriteContract("LottusNFT");

  // Handler function to claim the participant NFT
  const handleClaimNFT = async () => {
    try {
      // Calling the claimParticipantNFT function of the contract
      await claimNFT({
        functionName: "claimParticipantNFT",
        args: undefined,
      });
      console.log("NFT claimed successfully");
    } catch (e) {
      console.error("Error claiming NFT:", e);
    }
  };

  return (
    <>
      <Example />

      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center ">
            <div className="flex justify-center items-center h-[240px] w-[600px] mx-auto card rounded-box overflow-hidden ">
              <img
                alt="SE2 logo"
                className="cursor-pointer object-cover"
                style={{ width: "100%", height: "100%" }}
                src="/LottusBanner.png"
              />
            </div>
          </h1>
          <div className="flex flex-col w-full p-10">
            <div className="grid place-items-center">
              <div className="h-[600px] w-[1600px] card bg-base-300 rounded-box place-items-center overflow-hidden">
                {Banner ? (
                  <img
                    src={`https://ipfs.io/ipfs/${Banner}`}
                    alt="Lottus Banner"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">No banner available</span>
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-center p-5">
              <span className="stat-value p-2 text-7xl">
                Lottus N.{LottusNumber?.toString()}: {LottusName?.toString()}
              </span>
            </h1>

            <div className="flex justify-center">
              <span className="block text-2xl mb-10 w-[1300px] text-center">{LottusDesc?.toString()}</span>
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

            <div className="flex flex-col items-center pt-5 pb-10 space-y-5">
              {" "}
              <div className="stat-value">Lottus Runs on Base</div>
              <SquidWidgetIframe />{" "}
            </div>

            <div className="flex flex-col items-center pt-5 pb-10 space-y-10">
              <div className="flex justify-center items-center pt-5 pb-10 space-x-32">
                {/* Columna 1 */}

                <div className="flex-1">
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
                            <div className="text-xl">Check your wallet for the Winner NFT</div>
                          </div>
                        ) : (
                          <div>
                            <div className="stat-value p-2">You are still a hero!,</div>
                            <div className="text-xl">Sadly you did not win this time</div>
                            <div className="text-xl">but you still helped a charity receive:</div>
                            <div className="stat-value pt-3 pb-5">
                              {PrizeAmount ? Number(BigInt(PrizeAmount.toString())) / 1e18 : 0} ETH
                            </div>
                            <div>
                              <button onClick={handleClaimNFT} className="btn btn-primary">
                                Claim Participant NFT
                              </button>
                            </div>
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

              <div className=" gap-10">
                <div className="flex justify-center flex-col">
                  <UserBadges badges={userBadges || []} />
                </div>
              </div>

              {/* Mostrar PostLottusRoom solo cuando el Lottus haya terminado */}
              {!isActive && (
                <div className="flex-2">
                  <div className="stat-value p-10 text-center">Join our Post-Lottus Space to talk with the charity</div>
                  <PostLottusRoom roomUrl="https://app.huddle01.com/scw-exwz-ett" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-5 pt-32">
        <div className="divider divider-success pt-10"></div>
        <h1 className="text-center p-5">
          <span className="stat-value p-20 text-6xl">More info:</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-10 pb-10">
          {/* Columna 1: Ganadores Recientes y Donaciones Recientes */}
          <div className="overflow-x-auto p-5 bg-base-100 shadow-lg rounded-box">
            <h2 className="stat-value p-1 text-center text-lg md:text-2xl">Check recent Events</h2>

            <div className="max-h-40 overflow-y-auto mb-5">
              <h3 className="text-center text-md md:text-lg">Winners Record</h3>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Winner</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {winnerRecords?.map((record, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>
                        <Address address={record.winner} />
                      </td>
                      <td>{Number(record.amount) / 1e18} ETH</td>
                      <td>{new Date(Number(record.timestamp) * 1000).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="max-h-40 overflow-y-auto">
              <h3 className="text-center text-md md:text-lg">Charities Record</h3>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Charity</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {CharityRecords?.map((record, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>
                        <Address address={record.charity} />
                      </td>
                      <td>{Number(record.amount) / 1e18} ETH</td>
                      <td>{new Date(Number(record.timestamp) * 1000).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Columna 2: Suggest the Next Charity */}
          <div className="p-5 bg-base-100 shadow-lg rounded-box">
            <h2 className="stat-value p-1 text-center text-lg md:text-2xl">Suggest the Next Charity</h2>
            <p className="mt-3 p-5 text-center text-sm md:text-base">
              You can suggest the next charity organization to donate to here. Share your suggestions and help decide
              the next cause to support.
            </p>
            <div className="flex justify-center mt-3">
              <a
                href="https://discord.gg/dU7Am3PZdG"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-neutral px-10"
              >
                Propose on Discord
              </a>
            </div>
          </div>

          {/* Columna 3: NFT Awards & Certificates */}
          <div className="p-5 bg-base-100 shadow-lg rounded-box">
            <h2 className="stat-value p-1 text-center text-lg md:text-2xl">NFT Awards & Certificates</h2>
            <div className="flex flex-col md:flex-row justify-center mt-3 space-y-5 md:space-y-0 md:space-x-10">
              <div className="text-center">
                <h3 className="text-md md:text-lg font-bold mb-2">Winner NFT</h3>
                <div className="w-full md:w-40 h-40 bg-gray-300 flex items-center justify-center overflow-hidden rounded-box relative">
                  {Winner ? (
                    <img
                      src={`https://ipfs.io/ipfs/${Winner}`}
                      alt="Winner NFT"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">No Winner NFT available</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-md md:text-lg font-bold mb-2">Participant NFT</h3>
                <div className="w-full md:w-40 h-40 bg-gray-300 flex items-center justify-center overflow-hidden rounded-box relative">
                  {Participant ? (
                    <img
                      src={`https://ipfs.io/ipfs/${Participant}`}
                      alt="Participant NFT"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">No Participant NFT available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-sm md:text-base">
              There may be more prizes depending on collaborations with other dApps or protocols.
            </p>
          </div>
        </div>
        <h2 className="stat-value text-center">Lottus Archives</h2>
        <h2 className="stat-title text-center pb-10">Data Saved on FileCoin</h2>
        <div className="overflow-x-auto  bg-base-100 shadow-lg rounded-box ">
          <FilecoinComponent />
        </div>
      </div>

      <style jsx>{`
        .timeline {
          max-width: 800px;
          margin: 0 auto;
        }
        .timeline svg {
          width: 12px;
          height: 12px;
        }
        .timeline hr {
          height: 4px;
        }
        .active-step {
          background-color: #4caf50; /* Active step background color */
          color: white; /* Active step text color */
        }
        .tooltip {
          position: relative;
          display: inline-block;
        }
        .tooltip .tooltiptext {
          visibility: hidden;
          width: 220px;
          background-color: black;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px;
          position: absolute;
          z-index: 1;
          bottom: 125%; /* Position the tooltip above the text */
          left: 50%;
          margin-left: -110px; /* Center the tooltip */
          opacity: 0;
          transition: opacity 0.3s;
        }
        .tooltip .tooltiptext::after {
          content: "";
          position: absolute;
          top: 100%; /* At the bottom of the tooltip */
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: black transparent transparent transparent;
        }
        .tooltip:hover .tooltiptext {
          visibility: visible;
          opacity: 1;
        }
      `}</style>

      <h1 className="text-center pt-10">
        <span className="stat-value p-20 text-6xl">RoadMap:</span>
      </h1>

      <ul className="timeline justify-center pt-20 pb-20">
        <li>
          <div className="timeline-start timeline-box active-step tooltip">
            Beta Launch
            <span className="tooltiptext">
              The official launch of the Lottus beta version. Join us to test and experience the platform features.
            </span>
          </div>
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-8 h-8 text-primary"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-8 h-8 text-primary"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-end timeline-box tooltip">
            Generate Yields During Lottus
            <span className="tooltiptext">
              Enhancing integration with yield-generating protocols to maximize the impact of your contributions.
            </span>
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-start timeline-box tooltip">
            Lottus Automation
            <span className="tooltiptext">
              Implementing automation for the Lottus process to ensure transparency and efficiency.
            </span>
          </div>
          <div className="timeline-middle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-middle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-end timeline-box tooltip">
            Creation of MiniLottus
            <span className="tooltiptext">
              Introducing MiniLottus, community-driven lotteries to support specific causes.
            </span>
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-start timeline-box tooltip">
            Creation of DAO
            <span className="tooltiptext">
              Establishing a Decentralized Autonomous Organization (DAO) for community decision-making.
            </span>
          </div>
          <div className="timeline-middle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </li>
        <li>
          <hr />
          <div className="timeline-middle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-end timeline-box tooltip">
            Lottus Token?
            <span className="tooltiptext">
              Stay tuned for a potential Lottus token launch, bringing new opportunities for participation and
              governance.
            </span>
          </div>
          <hr />
        </li>
      </ul>

      <h1 className="text-center p-5 pt-20">
        <span className="stat-value p-20 text-6xl">F.A.Q:</span>
      </h1>
      <div className="flex items-center flex-col flex-grow pt-5">
        <div className="w-[1500px] px-5 space-y-4">
          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title text-xl font-medium bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content stat-value p-5">
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

          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content stat-value p-5">
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

          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content stat-value p-5">
              How is the raffle winner selected and how is fairness ensured?
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              <p>
                The raffle winner is selected using a Random Function, which ensures that the selection process is truly
                random and transparent.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content stat-value p-5">
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

          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content stat-value p-5">
              Is there going to be a Lottus token?
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              <p>
                We are planning to launch a Lottus token in the future. This token will enable us to become a DAO
                (Decentralized Autonomous Organization), providing users with voting power to choose the next charity.
                However, our current focus is on more pressing plans, such as automating the Lottus process and creating
                multiple Lottuses, not just the main one. Stay tuned for more updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
