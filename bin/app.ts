'use strict'
import { config } from '@mercadoni/elementals/config';
import { express } from 'express';
import { logger } from 'morgan';
import { ErrorReporting } = '@google-cloud/error-reporting';
import { promBundle } from 'express-prom-bundle';
const errors = new ErrorReporting({
  projectId: 'hawkeye-233620',
  keyFilename: 'Hawkeye-34cbe2a95bef.json',
  reportUnhandledRejections: true
});
const metricsMiddleware = promBundle({ includeMethod: true,
  includePath: true,
  buckets: [0.005, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0, 2.0, 3.0, 4.0, 5.0, 10, 30] });


const indexRouter = require('./routes/index')
const healthCheckRouter = require('./routes/health_check')
const historyRouter = require('./src/history/routes')
const app = express();

app.use(logger(':date[iso] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));
app.use(metricsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/*
app.use('/', indexRouter)
app.use('/alive', healthCheckRouter)
app.use('/hawkeye/health', healthCheckRouter)
app.use('/orders',
  passport.authenticate('serviceAuth', { session: false }),
  historyRouter
) */
app.use(errors.express);

process.on('uncaughtException', (e) => {
  console.error(e)
  errors.report(e)
  process.exit(1)
});

module.exports = app
