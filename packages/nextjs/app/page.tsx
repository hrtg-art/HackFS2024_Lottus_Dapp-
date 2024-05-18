"use client";

// import Link from "next/link";
import type { NextPage } from "next";
import Countdown from "~~/components/Countdown";
// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
import CounterComponent from "~~/components/CounterComponent";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  const { data: price1 } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "getPrizePool",
  });

  const { data: CurrentLottus } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "currentLottery",
  });

  const { data: LastWinner } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "getWinner",
  });

  const [, , , ethValue] = CurrentLottus || [];
  const [, LottusName, ,] = CurrentLottus || [];
  const [LottusNumber, , ,] = CurrentLottus || [];
  const [, , LottusDesc] = CurrentLottus || [];
  const [, , , , Charity] = CurrentLottus || [];
  const isActive = CurrentLottus ? CurrentLottus[7] : false;

  const ethValueNumber = ethValue ? Number(BigInt(ethValue.toString())) / 1e18 : 0;

  const { data: TicketsSold } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "getParticipants",
  });

  const numberOfParticipants = TicketsSold ? TicketsSold.length : 0;
  const uniqueParticipants = TicketsSold ? new Set(TicketsSold).size : 0;

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-20">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-8xl font-bold">Lottus</span>
            <span className="block text-1xl mb-4">Get a chance of winning by helping others&#39;...</span>
          </h1>
          <div className="flex flex-col w-full">
            <div className="grid place-items-center">
              <div className="grid h-[300px] w-[900px] card bg-base-300 rounded-box place-items-center">content</div>
            </div>

            <h1 className="text-center p-5">
              <span className="stat-value p-2">
                Lottus N.{LottusNumber?.toString()}: {LottusName?.toString()}
              </span>
            </h1>

            <div className="flex justify-center">
              <span className="block text-1xl mb-10 w-[900px] text-center">{LottusDesc?.toString()}</span>
            </div>

            <div className="stats shadow">
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
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
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
                <div className="stat-title">Prize Pool</div>
                <div className="stat-value">{price1 ? Number(BigInt(price1.toString())) / 1e18 : 0} ETH*</div>
                <div className="stat-desc">*40% of the total</div>
              </div>
            </div>

            <div className="flex justify-center items-center pt-10">
              <div className="indicator">
                <div className="indicator-item indicator-bottom"></div>
                <div className="stat-actions flex flex-col space-y-2 px-4">
                  <CounterComponent ethValue={ethValueNumber} />
                  <div className="flex justify-center p-10">
                    <button className="btn btn-primary" disabled={!isActive}>
                      {isActive ? "Buy Tickets" : "This Lottus has Ended"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="divider divider-success"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Columna 1: Ganadores Recientes y Donaciones Recientes */}
          <div className="p-5 bg-base-300 shadow-lg rounded-box">
            <div className="mb-5">
              <h2 className="stat-value p-1 text-center">Recent Winners</h2>
              <ul className="list-disc list-inside">
                <li>Ganador 1</li>
                <li>Ganador 2</li>
                <li>Ganador 3</li>
                {/* Añade más ganadores aquí */}
              </ul>
            </div>
            <div>
              <h2 className="stat-value p-1 text-center">Recent Donations</h2>
              <ul className="list-disc list-inside">
                <li>Donación 1</li>
                <li>Donación 2</li>
                <li>Donación 3</li>
                {/* Añade más donaciones aquí */}
              </ul>
            </div>
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
            {/* Add a form or any other content here */}
          </div>

          {/* Columna 3: NFT Awards & Certificates */}
          <div className="p-5 bg-base-300 shadow-lg rounded-box w-[600px]">
            <h2 className="stat-value p-1 text-center">NFT Awards & Certificates</h2>
            <div className="flex justify-center mt-3 space-x-2">
              <div className="w-1/2 h-32 bg-gray-300 flex items-center justify-center">
                <span className="text-center text-gray-600">Winner NFT</span>
              </div>
              <div className="w-1/2 h-32 bg-gray-300 flex items-center justify-center">
                <span className="text-center text-gray-600">Participant NFT</span>
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
