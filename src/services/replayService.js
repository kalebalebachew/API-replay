import axios from 'axios';
import { getFailedRequests, removeRequestFromQueue } from '../storage/inMemory.js';
import { logger } from '../helpers/logger.js';

export const replayFailedRequests = async () => {
  const failedRequests = getFailedRequests();

  for (const request of failedRequests) {
    try {
      await axios({
        method: request.method,
        url: request.url,
        headers: request.headers,
        data: request.body,
      });
      logger.info(`Successfully replayed request to ${request.url}`);
      removeRequestFromQueue(request); 
    } catch (error) {
      logger.error(`Failed to replay request: ${error.message}`);
    }
  }
};


setInterval(replayFailedRequests, 60000); 
