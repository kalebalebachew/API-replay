import { storeFailedRequest } from '../../storages/fileStorage.js'
import logger from '../../helpers/logger.js';

export const requestReplayMiddleware = async (req, res, next) => {
  try {
    await next(); 
  } catch (error) {
    logger.error(`Request failed: ${error.message}`);
    
    if (error.response && [500, 502, 504].includes(error.response.status)) {
      await storeFailedRequest(req);
      res.status(500).send('Request failed and will be retried.');
    } else {
      next(error); 
    }
  }
};
