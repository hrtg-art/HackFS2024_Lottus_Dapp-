"use client";

// import Link from "next/link";
import type { NextPage } from "next";
import Countdown from "~~/components/Countdown";
// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
import CounterComponent from "~~/components/CounterComponent";

// import React, { useState } from 'react';

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-20">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-8xl font-bold">Lottus</span>
            <span className="block text-1xl mb-4">Get a chance of winning by helping others...</span>
          </h1>
          <div className="flex flex-col w-full">
            <div className="grid place-items-center">
              <div className="grid h-[300px] w-[900px] card bg-base-300 rounded-box place-items-center">content</div>
            </div>

            <h1 className="text-center p-5">
              <span className="block text-2xl font-bold">Enter The main Lottus Round</span>
            </h1>

            <div className="flex justify-center">
              <span className="block text-1xl mb-10 w-[900px] text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </span>
            </div>

            <div className="stats shadow">
              <div className="flex justify-center p-10">
                <Countdown />
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Price Per Ticket</div>
                <div className="stat-value">0.01 ETH</div>
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
                <div className="stat-title">Total Participants</div>
                <div className="stat-value">40</div>
                <div className="stat-desc"></div>
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
                <div className="stat-value">0.16 ETH*</div>
                <div className="stat-desc">*40% of the total</div>
              </div>
            </div>

            <div className="flex justify-center items-center pt-10">
              <div className="indicator">
                <div className="indicator-item indicator-bottom"></div>
                <div className="stat-actions flex flex-col space-y-2 px-4">
                  <CounterComponent />
                  <button className="btn btn-primary">Buy Tickets</button>
                </div>
              </div>
            </div>

            <div className="divider divider-success"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
