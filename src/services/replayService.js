import axios from "axios";
import { getFailedRequests, removeRequestFromQueue } from '../../storages/fileStorage.js'
import { makeRequestWithRetry } from '../../helpers/retryrequest.js'
import logger from '../../helpers/logger.js';

export const replayFailedRequests = async () => {
  const failedRequests = getFailedRequests(); 

  for (const request of failedRequests) {
    try {
      const requestFn = async (options) => {
        return await axios({
          method: request.method,
          url: `http://localhost:8000${request.url}`,
          headers: request.headers,
          data: request.body,
        });
      };

      await makeRequestWithRetry(requestFn, {});

      logger.info(`Successfully replayed request to ${request.url}`);
      removeRequestFromQueue(request); 
    } catch (error) {
      logger.error(`Failed to replay request to ${request.url} after retries: ${error.message}`);
    }
  }
};
