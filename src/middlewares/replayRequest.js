import { storeFailedRequest } from '../../storages/fileStorage.js'
import logger from '../../helpers/logger.js'

export const requestReplayMiddleware = async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode >= 500) {
      logger.info(`Capturing failed request for replay: ${req.method} ${req.originalUrl}`);
      await storeFailedRequest(req); 
    }
  });

  next();
};
