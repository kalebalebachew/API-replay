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
### Example Usage
``` javascript
import { replayFailedRequests } from 'api-replay';

(async () => {
  await replayFailedRequests({
    baseURL: "https://your-api.com", // The base URL for your server
    retryLimit: 5,                    // Optional retry limit
    customHandler: axios,             // Optional custom request handler (e.g., axios)
  });
})();


```


