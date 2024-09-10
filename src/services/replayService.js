import axios from "axios";
import { getFailedRequests, removeRequestFromQueue } from '../../storages/fileStorage.js';
import logger from '../../helpers/logger.js';

/**
 * Replays failed HTTP requests
 * @param {string} baseURL - The base URL for the server where requests should be replayed.
 * @param {number} retryLimit - Optional limit for the number of retries before giving up.
 * @param {Function} customHandler - Optional custom handler for request replay (e.g., axios or another library).
 */
export const replayFailedRequests = async ({ baseURL = "http://localhost:3005", retryLimit = 3, customHandler = axios } = {}) => {
  const failedRequests = getFailedRequests(); 

  if (failedRequests.length === 0) {
    logger.info("No failed requests to replay.");
    return;
  }

  logger.info(`Found ${failedRequests.length} failed requests to replay.`);

  for (const request of failedRequests) {
    try {
      let retries = request.retries || 0;
      
      if (retries >= retryLimit) {
        logger.error(`Max retry limit reached for ${request.url}. Removing from queue.`);
        removeRequestFromQueue(request);
        continue; 
      }

      logger.info(`Replaying request: ${request.method} ${baseURL}${request.url}`);
      await customHandler({
        method: request.method,
        url: `${baseURL}${request.url}`,
        headers: request.headers,
        data: request.body,
      });

      logger.info(`Successfully replayed request to ${request.url}`);
      removeRequestFromQueue(request);
    } catch (error) {
      logger.error(`Failed to replay request to ${request.url}: ${error.message}`);
      
      request.retries = (request.retries || 0) + 1;

    }
  }
};
