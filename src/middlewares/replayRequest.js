import { storeFailedRequest }from  '../storage/inMemory.js'
import { logger } from '../helpers/logger.js';

export const requestReplayMiddleware = async (req, res, next) => {
  try {
    next(); 
  } catch (error) {
    if (error.response && [500, 502, 504].includes(error.response.status)) {
      logger.error(`Request failed: ${error.message}`);
      await storeFailedRequest(req);
      return res.status(500).send('Request failed and will be retried.');
    }
    next(error); 
  }
};
