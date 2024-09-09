# API-Replay 

This package provides an Express middleware to capture failed requests and retry them automatically. It also provides a service to replay failed requests.

## Features

- Capture and store failed requests.
- Automatically replay failed requests with retry logic.
- Supports retry with exponential backoff.

## Installation

Install the package via npm:

```bash
npm install api-replay
```
### capturing failed requests
``` javascript
import express from 'express';
import { requestReplayMiddleware, replayFailedRequests } from 'api-replay';

const app = express();

app.use(express.json());
app.use(requestReplayMiddleware);

app.post('/api/endpoint', (req, res) => {
  // Simulate a request failure
  if (Math.random() > 0.5) {
    res.status(500).send('Simulated failure');
  } else {
    res.status(200).send('Request succeeded');
  }
});

// Periodically replay failed requests (every 10 minutes)
setInterval(() => {
  replayFailedRequests();
}, 600000);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```
### handling retry
``` javascript
import { replayFailedRequests } from 'api-replay';

// Manually trigger replay of failed requests
replayFailedRequests();

```

