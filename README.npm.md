# API Replay Middleware

A simple middleware for retrying failed API requests.

## Installation

```bash
npm install api-replay
```
### Example Usage
#### Applying the middleware
- Apply the middleware globally
``` javascript
import { requestReplayMiddleware } from 'api-replay';

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
import { replayFailedRequests } from 'api-replay';

replayFailedRequests({ retryLimit: 5 }); // you should configure your retry limit tho
```

If you have anything to say or questions reach out kalebalebachew4@gmai.com