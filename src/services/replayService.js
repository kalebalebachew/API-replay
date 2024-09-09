import axios from 'axios';
import { getFailedRequests, removeRequestFromQueue } from '../storage/fileStorage.js';
import { logger } from '../helpers/logger.js';

export const replayFailedRequests = async () => {
    const failedRequests = getFailedRequests(); 
  
    for (const request of failedRequests) {
      try {
        await axios({
          method: request.method,
          url: `http://localhost:8000${request.url}`, // Replay on the local server
          headers: request.headers,
          data: request.body,
        });
        
        // If successful, log the success and remove the request from the queue
        logger.info(`Successfully replayed request to ${request.url}`);
        removeRequestFromQueue(request);

      } catch (error) {
        logger.error(`Failed to replay request: ${error.message}`);
        removeRequestFromQueue(request); 
      }
    }
};
