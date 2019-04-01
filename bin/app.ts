'use strict'

const config = require('@mercadoni/elementals/config')
const express = require('express')
const { ErrorReporting } = require('@google-cloud/error-reporting')
const errors = new ErrorReporting({
  projectId: 'hawkeye-233620',
  keyFilename: 'Hawkeye-34cbe2a95bef.json',
  reportUnhandledRejections: true
})
const promBundle = require('express-prom-bundle')
const metricsMiddleware = promBundle({ includeMethod: true,
  includePath: true,
  buckets: [0.005, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0, 2.0, 3.0, 4.0, 5.0, 10, 30] })
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
const { BasicStrategy } = require('passport-http')

const indexRouter = require('./routes/index')
const healthCheckRouter = require('./routes/health_check')
const historyRouter = require('./src/history/routes')

const app = express()

app.use(logger(':date[iso] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'))
app.use(metricsMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())

app.use(passport.initialize())

passport.use('serviceAuth', new BasicStrategy((username, password, done) => {
  const user = config.get('HTTP_USER') || config.get('http_user')
  const pwd = config.get('HTTP_PASSWORD') || config.get('http_password')
  if (username !== user || password !== pwd) {
    return done(null, false)
  }
  return done(null, username)
}))

app.use('/', indexRouter)
app.use('/alive', healthCheckRouter)
app.use('/hawkeye/health', healthCheckRouter)
app.use('/orders',
  passport.authenticate('serviceAuth', { session: false }),
  historyRouter
)
app.use(errors.express)

process.on('uncaughtException', (e) => {
  console.error(e)
  errors.report(e)
  process.exit(1)
})

require('./src/tracking/rabbitmq-listeners')
require('./src/tracking/background')

module.exports = app
