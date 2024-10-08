# Replay-API

This package provides an Express middleware to capture failed requests and retry them automatically. It also provides a service to replay failed requests.

## Features

- Capture and store failed requests.
- Automatically replay failed requests 

## Installation

Install the package via npm:

```bash
npm install replay-api
```
### Example Usage
#### Applying the middleware
- Apply the middleware globally
``` javascript
import { requestReplayMiddleware } from 'replay-api';

app.use(requestReplayMiddleware);

```
- Apply the middleware to specific routes
``` javascript
app.post('/api/test-endpoint', requestReplayMiddleware, (req, res) => {
  // Route logic
});
```
#### Replaying failed requests
``` javascript
import { replayFailedRequests } from 'replay-api';

replayFailedRequests({ retryLimit: 5 }); // you should configure your retry limit tho
```



