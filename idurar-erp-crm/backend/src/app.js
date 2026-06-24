const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const adminAuth = require('./controllers/coreControllers/adminAuth');
const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');

// Customer Portal routes
const customerApiRouter = require('./routes/customerRoutes/customerApi');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Public admin auth routes
app.use('/api', coreAuthRouter);

// Customer portal routes use customer JWTs and must run before admin-protected /api routes.
app.use('/api', customerApiRouter);

// Protected admin routes
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

app.use(errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

module.exports = app;
