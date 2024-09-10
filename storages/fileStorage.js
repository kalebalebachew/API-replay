import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import logger from '../helpers/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../../logs/failedRequests.json');

const ensureDirectoryExists = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const getFailedRequests = () => {
  ensureDirectoryExists();
  if (!fs.existsSync(filePath)) {
    logger.info("Failed requests file does not exist. Initializing an empty list.");
    return [];
  }

  const data = fs.readFileSync(filePath, 'utf8');
  return data ? JSON.parse(data) : [];
};

export const storeFailedRequest = (req) => {
  ensureDirectoryExists(); 

  const failedRequests = getFailedRequests(); 
  const newRequest = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    timestamp: Date.now(),
    retries: 0,
  };

  logger.info(`Storing failed request: ${JSON.stringify(newRequest)}`); 

  failedRequests.push(newRequest); 

  fs.writeFileSync(filePath, JSON.stringify(failedRequests, null, 2));
  logger.info(`Stored failed request: ${req.method} ${req.originalUrl}`);
};

export const removeRequestFromQueue = (requestData) => {
  const failedRequests = getFailedRequests();
  const updatedRequests = failedRequests.filter(req => req.timestamp !== requestData.timestamp);
  fs.writeFileSync(filePath, JSON.stringify(updatedRequests, null, 2));
  logger.info(`Removed request from queue: ${requestData.url}`);
};
