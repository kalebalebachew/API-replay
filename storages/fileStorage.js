import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";
import logger from "../helpers/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, "./failedrequests.json");

const ensureDirectoryExists = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const readFailedRequestsFromFile = () => {
    try {
      ensureDirectoryExists();
      if (!fs.existsSync(filePath)) {
        logger.info("Failed requests file does not exist. Initializing an empty list.");
        return [];
      }
      const data = fs.readFileSync(filePath, "utf8");
      if (!data) {
        logger.info("Failed requests file is empty. Initializing an empty list.");
        return [];
      }
      logger.info("Reading failed requests from file.");
      return JSON.parse(data);
    } catch (error) {
      logger.error(`Error reading from file: ${error.message}`);
      return []; 
    }
  };
  

export const writeFailedRequestsToFile = (requests) => {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(filePath, JSON.stringify(requests, null, 2));
    logger.info("Successfully wrote failed requests to file.");
  } catch (error) {
    logger.error(`Error writing to file: ${error.message}`);
  }
};
export const storeFailedRequest = async (req) => {
    const requestData = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      timestamp: Date.now(),
      retries: 0, 
    };
  
    if (!requestData.method || !requestData.url) {
      logger.error("Invalid request data. Skipping storing failed request.");
      return;
    }
  
    try {
      const requests = readFailedRequestsFromFile();
      requests.push(requestData);
      writeFailedRequestsToFile(requests);
      logger.info(`Stored failed request: ${req.method} ${req.originalUrl}`);
    } catch (error) {
      logger.error(`Error storing failed request: ${error.message}`);
    }
  };
  
  

export const getFailedRequests = () => {
  return readFailedRequestsFromFile();
};

export const removeRequestFromQueue = (requestData) => {
    try {
      let requests = readFailedRequestsFromFile();
      const remainingRequests = requests.filter(req => req.timestamp !== requestData.timestamp);
      
      if (requests.length === remainingRequests.length) {
        logger.warn(`Request not found in the queue for removal: ${requestData.url}`);
      } else {
        writeFailedRequestsToFile(remainingRequests);
        logger.info(`Successfully removed request: ${requestData.method} ${requestData.url}`);
      }
    } catch (error) {
      logger.error(`Error removing request from file: ${error.message}`);
    }
  };
