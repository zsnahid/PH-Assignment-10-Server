// CORS configuration
const corsOptions = {
  origin: true, // This will copy the Origin header from the request
  credentials: false, // Setting this to false since we're not using credentials
};

module.exports = corsOptions;
