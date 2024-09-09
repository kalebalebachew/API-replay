import retry from "retry";
import logger from "../helpers/logger.js";

export const makeRequestWithRetry = async (requestFn, options) => {
  return new Promise((resolve, reject) => {
    const operation = retry.operation({
      retries: 5,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 8000,
      randomize: true,
    });

    operation.attempt(async (currentAttempt) => {
      try {
        const response = await requestFn(options);
        resolve(response);
      } catch (error) {
        logger.error(
          `Attempt ${currentAttempt} failed: ${error.message}. Retrying...`
        );

        if (operation.retry(error)) {
          return;
        }

        reject(operation.mainError());
      }
    });
  });
};
