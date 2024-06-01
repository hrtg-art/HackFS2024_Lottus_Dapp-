import lighthouse from "@lighthouse-web3/sdk";
import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;

if (!apiKey) {
  throw new Error("Lighthouse API key is not defined");
}

export const uploadDataToLighthouse = async (data: object, path: string): Promise<string | undefined> => {
  try {
    const response = await lighthouse.uploadText(JSON.stringify(data), apiKey, path);
    console.log(response);
    return response.data.Hash; // CID
  } catch (error) {
    console.error("Error uploading data to Lighthouse:", error);
  }
};

export const getUploads = async (): Promise<any> => {
  try {
    const response = await lighthouse.getUploads(apiKey);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching uploads from Lighthouse:", error);
  }
};

export const fetchFileContent = async (cid: string): Promise<any> => {
  try {
    const response = await axios.get(`https://gateway.lighthouse.storage/ipfs/${cid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching file content from Lighthouse:", error);
  }
};
