import axios from "axios";
import {
  getFailedRequests,
  removeRequestFromQueue,
  writeFailedRequestsToFile
} from '../../storages/fileStorage.js'
import logger from '../../helpers/logger.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async (request, delayMs) => {
  if (request.retries >= 3) {
    logger.error(`Max retries reached for request to ${request.url}. Removing from queue.`);
    removeRequestFromQueue(request);
    return;
  }

  try {
    await axios({
      method: request.method,
      url: `http://localhost:8000${request.url}`,
      headers: request.headers,
      data: request.body,
    });

    logger.info(`Successfully replayed request to ${request.url}`);
    removeRequestFromQueue(request);
  } catch (error) {
    logger.error(`Failed to replay request to ${request.url}: ${error.message}`);
    request.retries += 1;
    writeFailedRequestsToFile(getFailedRequests()); 
    await delay(delayMs);
    await retryRequest(request, delayMs * 2); 
  }
};

export const replayFailedRequests = async () => {
  const failedRequests = getFailedRequests();

  for (const request of failedRequests) {
    await retryRequest(request, 1000); 
  }
};
