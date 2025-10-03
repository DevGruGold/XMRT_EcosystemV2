const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const path = require('path');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// Direct API routes for frontend compatibility
const xmrtRoute = require('./routes/xmrt.route');
app.use('/api', xmrtRoute);

// Serve static files from the frontend build
const frontendPath = path.join(__dirname, '../public');
app.use(express.static(frontendPath));

// Serve the React app for all non-API routes
app.get('*', (req, res) => {
  // Don't serve the React app for API routes
  if (req.path.startsWith('/api') || req.path.startsWith('/v1')) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'API endpoint not found' });
  }
  
  // Serve the React app
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/v1')) {
    next(new ApiError(httpStatus.NOT_FOUND, 'API endpoint not found'));
  } else {
    next();
  }
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
