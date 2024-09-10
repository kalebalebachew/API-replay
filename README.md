# API-Replay 

This package provides an Express middleware to capture failed requests and retry them automatically. It also provides a service to replay failed requests.

## Features

- Capture and store failed requests.
- Automatically replay failed requests 

## Installation

Install the package via npm:

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

## Contributing
### Contributions are welcome! Here's how you can contribute:
- Fork the repository.
- Create a new branch (git checkout -b feature-branch)
- Make your changes and commit (git commit -m 'added something please merge my pr kaleb lol :)')
- Push to the branch (git push origin feature-branch).
- Open a Pull Request.
## License
- This project is licensed under the GNU General Public License v3.0. See the LICENSE file for details.


