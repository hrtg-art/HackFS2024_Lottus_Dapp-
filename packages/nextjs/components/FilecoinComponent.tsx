import React, { useEffect, useRef, useState } from "react";
import { fetchFileContent, getUploads, uploadDataToLighthouse } from "../utils/scaffold-eth/lighthouse";
import { Address } from "./scaffold-eth/Address";
import { ethers } from "ethers";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth/useScaffoldWatchContractEvent";

const FilecoinComponent: React.FC = () => {
  const [uploads, setUploads] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const lastProcessedLotteryIdRef = useRef<string | null>(null);

  const handleLotteryEnded = async (logs: any[]) => {
    const uniqueLogs = logs.reduce((acc: any[], log) => {
      if (!acc.find((item: any) => item.transactionHash === log.transactionHash)) {
        acc.push(log);
      }
      return acc;
    }, []);

    for (const log of uniqueLogs) {
      const { args, transactionHash } = log;
      const { lotteryId, name, description, ticketPrice, charity, participants, bannerCID } = args;

      if (lastProcessedLotteryIdRef.current === lotteryId.toString()) {
        continue; // Skip if the lotteryId has already been processed
      }

      lastProcessedLotteryIdRef.current = lotteryId.toString();

      const fileName = `lottus_${lotteryId}_${name}_${new Date().toISOString().split("T")[0]}_participants.json`;

      const participantsData = {
        lotteryId: lotteryId.toString(),
        name,
        description,
        ticketPrice: ethers.utils.formatEther(ticketPrice),
        charity,
        participants,
        bannerCID,
        endTime: new Date().toISOString(),
        transactionId: transactionHash,
      };

      await uploadDataToLighthouse(participantsData, fileName);
    }
    fetchUploads();
  };

  const fetchUploads = async () => {
    const response = await getUploads();
    if (response && response.data && response.data.fileList) {
      const uploadsWithBannerCID = await Promise.all(
        response.data.fileList.map(async (file: { cid: string }) => {
          const fileContent = await fetchFileContent(file.cid);
          return { ...file, ...fileContent };
        }),
      );
      setUploads(uploadsWithBannerCID);
    }
  };

  const handleViewDetails = (file: any) => {
    setSelectedFile(file);
    const modal = document.getElementById("filecoin_modal") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  useScaffoldWatchContractEvent({
    contractName: "LottusLottery",
    eventName: "LotteryEnded",
    onLogs: handleLotteryEnded,
  });

  return (
    <div className="container mx-auto max-h-[300px] p-4 flex flex-col h-screen pt-10 pb-20">
      <div className="flex-1 overflow-y-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Banner</th>
              <th className="px-4 py-2">Lottus Name</th>
              <th className="px-4 py-2">Ended on</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map(file => (
              <tr key={file.cid} className="text-center">
                <td className="border py-2">
                  {file.bannerCID && (
                    <img
                      src={`https://ipfs.io/ipfs/${file.bannerCID}`}
                      alt="Banner"
                      width={200}
                      height={64}
                      style={{ objectFit: "cover", margin: "auto", borderRadius: "8px" }}
                    />
                  )}
                </td>
                <td className="border px-4 py-2">{file.name}</td>
                <td className="border px-4 py-2">{new Date(file.endTime).toLocaleString()}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleViewDetails(file)} className="btn btn-neutral px-10">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <dialog id="filecoin_modal" className="modal">
        <div className="modal-box w-[600px] h-[800px] max-w-full">
          <form method="dialog">
            <button
              onClick={() => setSelectedFile(null)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          {selectedFile && (
            <div>
              <div className="text-center">
                <h2 className="text-xl stat-value">Archive of: {selectedFile.name}</h2>
                <div className="flex justify-center items-center mb-4">
                  <img
                    src={`https://ipfs.io/ipfs/${selectedFile.bannerCID}`}
                    alt="Banner"
                    width={500}
                    height={200}
                    style={{ objectFit: "cover", margin: "auto", borderRadius: "8px" }}
                  />
                </div>
                <h2 className="text-xl stat-value pt-5">Description:</h2>
                <p className="text-gray-500 mb-2">{selectedFile.description}</p>
                <h2 className="text-xl stat-value pt-5">Ticket Price:</h2>
                <p className="text-sm">{selectedFile.ticketPrice} ETH</p>
                <h2 className="text-xl stat-value pt-5">Charity</h2>
                <p className="text-sm">Charity: {selectedFile.charity}</p>
                <h2 className="text-xl stat-value pt-5">End Time:</h2>
                <p className="text-sm">End Time: {new Date(selectedFile.endTime).toLocaleString()}</p>
                <h2 className="text-xl stat-value pt-5">Transaction ID:</h2>
                <p className="text-sm pb-5">{selectedFile.transactionId}</p>
                <div className="collapse bg-base-200">
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
                    <span className="loading loading-ring loading-xl"></span> Tap here to see the List of participants
                    for this lottus
                  </div>
                  <div className="collapse-content bg-neutral text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
                    <div className="max-h-40 overflow-y-auto">
                      <ul className="list-inside">
                        {selectedFile.participants.map((participant: string, index: number) => (
                          <li key={index}>
                            {" "}
                            <Address address={participant} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default FilecoinComponent;
