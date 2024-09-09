import { storeFailedRequest } from '../../storages/fileStorage.js';
import  logger  from '../helpers/logger.js';

export const requestReplayMiddleware = async (req, res, next) => {
  try {
    await next(); 
  } catch (error) {
    logger.error(`Request failed with error: ${error.message}`);
    
    if (error.response && [500, 502, 504].includes(error.response.status)) {
      logger.error(`Capturing and storing failed request for URL: ${req.originalUrl}`);
      
      await storeFailedRequest(req);

      return res.status(500).send('Request failed and will be retried.');
    }

    next(error); 
  }
};
