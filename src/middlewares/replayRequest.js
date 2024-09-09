import { storeFailedRequest } from '../../storages/fileStorage.js'
import logger from '../../helpers/logger.js';

// Middleware to capture failed requests and store them for replay
export const requestReplayMiddleware = async (req, res, next) => {
  try {
    await next(); // Proceed with the request
  } catch (error) {
    logger.error(`Request failed: ${error.message}`);
    
    // Store the failed request if it's a server-side error
    if (error.response && [500, 502, 504].includes(error.response.status)) {
      await storeFailedRequest(req);
      res.status(500).send('Request failed and will be retried.');
    } else {
      next(error); // Forward other errors
    }
  }
};
