import express from "express";
import { requestReplayMiddleware } from './src/middlewares/replayRequest.js';
import { replayFailedRequests } from './src/services/replayService.js';
import logger from "./helpers/logger.js";

const app = express(); 

app.use(express.json()); 
app.use(requestReplayMiddleware);

app.post("/api/test-endpoint", (req, res) => {
  if (Math.random() > 0.5) {
    logger.info("Request failed, simulating 500 error");
    res.status(500).send("Simulated failure");
  } else {
    logger.info("Request succeeded");
    res.status(200).send("Request succeeded");
  }
});


const PORT = 3005;
app.listen(PORT, () => {
  logger.info(`Test server running on port ${PORT}`);

  setInterval(async () => {
    try {
      await replayFailedRequests(); 
      logger.info("Replay of failed requests complete");
    } catch (error) {
      logger.error("Error replaying failed requests:", error.message);
    }
  }, 10000);
});
