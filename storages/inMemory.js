let requestQueue = [];

export const storeFailedRequest = async (req) => {
  const requestData = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    timestamp: Date.now(),
  };
  
  console.log(`Storing failed request for retry: ${req.method} ${req.originalUrl}`);

  requestQueue.push(requestData);
};

export const getFailedRequests = () => requestQueue;

export const removeRequestFromQueue = (requestData) => {
  requestQueue = requestQueue.filter(req => req !== requestData);
};
