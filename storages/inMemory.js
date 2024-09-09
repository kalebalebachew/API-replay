let requestQueue = [];

export const storeFailedRequest = async (req) => {
  const requestData = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    timestamp: Date.now(),
  };
  requestQueue.push(requestData);
};

export const getFailedRequests = () => {
  return requestQueue;
};

export const removeRequestFromQueue = (requestData) => {
  requestQueue = requestQueue.filter(req => req !== requestData);
};