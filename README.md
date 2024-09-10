# Replay API

A simple middleware for retrying failed API requests.

## Installation

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

replayFailedRequests({ retryLimit: 5, retryDelay: 1000 }); // you should configure your retry limit and retry delay tho
```

If you have anything to say or questions reach out kalebalebachew4@gmai.com