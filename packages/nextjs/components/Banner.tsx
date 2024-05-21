import { useEffect, useState } from "react";

// import { XMarkIcon } from '@heroicons/react/20/solid';

export default function Example() {
  const [ethVolume, setEthVolume] = useState<number | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchEthVolume = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30",
        );
        const data = await response.json();
        const totalVolume = data.total_volumes.reduce((sum: number, volume: [number, number]) => sum + volume[1], 0);
        setEthVolume(totalVolume);
      } catch (error) {
        console.error("Error fetching Ethereum volume:", error);
      }
    };

    const fetchEthPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error("Error fetching Ethereum price:", error);
      }
    };

    fetchEthVolume();
    fetchEthPrice();
  }, []);

  const calculateCharityAmount = (volume: number) => (volume * 0.00000001).toFixed(2);

  const formatCurrency = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const formatEth = (value: number) => {
    if (ethPrice) {
      const ethValue = (value / ethPrice).toFixed(4);
      return `${ethValue} ETH`;
    }
    return "";
  };

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-gray-900">
          <strong className="font-semibold">Ethereum Volume</strong>
          <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
            <circle cx={1} cy={1} r={1} />
          </svg>
          {ethVolume !== null ? (
            <>
              In the last month, {formatCurrency(ethVolume)} ({formatEth(ethVolume)}) has been transacted. Imagine if
              just 0.000001% of this was used for charity.{" "}
              {formatCurrency(parseFloat(calculateCharityAmount(ethVolume)))} (
              {formatEth(parseFloat(calculateCharityAmount(ethVolume)))}) can change the world!
            </>
          ) : (
            "Loading Ethereum volume data..."
          )}
        </p>
        <a
          href="#"
          className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          Help us create a better world. <span aria-hidden="true"></span>
        </a>
      </div>
      <div className="flex flex-1 justify-end">
        <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]"></button>
      </div>
    </div>
  );
}
