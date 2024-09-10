import axios from "axios";
import { getFailedRequests, removeRequestFromQueue } from '../../storages/fileStorage.js';
import logger from '../../helpers/logger.js';

/**
 * Replays failed HTTP requests
 * @param {string} baseURL - The base URL for the server where requests should be replayed.
 * @param {number} retryLimit - Optional limit for the number of retries before giving up.
 * @param {Function} customHandler - Optional custom handler for request replay (e.g., axios or another library).
 */
export const replayFailedRequests = async ({ retryLimit = 5 } = {}) => {
  const failedRequests = getFailedRequests(); 

  if (failedRequests.length === 0) {
    logger.info("No failed requests to replay.");
    return;
  }

  logger.info(`Found ${failedRequests.length} failed requests to replay.`);

  for (const request of failedRequests) {
    let retries = request.retries || 0;

    if (retries >= retryLimit) {
      logger.error(`Max retry limit reached for ${request.fullUrl}. Removing from queue.`);
      removeRequestFromQueue(request);
      continue; 
    }

    try {
      logger.info(`Replaying request: ${request.method} ${request.fullUrl}`);
      await axios({
        method: request.method,
        url: request.fullUrl, 
        headers: request.headers,
        data: request.body,
      });

      logger.info(`Successfully replayed request to ${request.fullUrl}`);
      removeRequestFromQueue(request); 
    } catch (error) {
      logger.error(`Failed to replay request to ${request.fullUrl}: ${error.message}`);
      request.retries = (request.retries || 0) + 1;
    }
  }
};
