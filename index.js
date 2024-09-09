import express from "express";
import { requestReplayMiddleware } from "./src/middlewares/replayRequest.js";
import  logger  from "./src/helpers/logger.js";

const app = express();

app.use(express.json());
app.use(requestReplayMiddleware);

app.post("/api/some-endpoint", (req, res) => {
  if (Math.random() > 0.5) {
    res.status(500).send("Simulated failure");
  } else {
    res.status(200).send("Request succeeded");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
