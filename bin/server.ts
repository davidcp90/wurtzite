import cluster from 'cluster';
import colors from 'colors/safe';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import prometheus from 'prom-client';
import debug from 'debug';
import express from 'express';
import { configProvider } from '../src/providers';
import { App } from '../src/app';

prometheus.collectDefaultMetrics();

const normalizePort = (val: any) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
console.info(colors.magenta('✥ Initializing Wurzite Server.... ✥'));
if (cluster.isMaster) {
  for (let i = 0; i < 2; i++) {
    cluster.fork();
  }

  const metricsServer = express();
  const aggregatorRegistry = new prometheus.AggregatorRegistry();

  metricsServer.get('/metrics', async (req, res, next) => {
    try {
      const metrics = await aggregatorRegistry.clusterMetrics();
      res.set('Content-Type', aggregatorRegistry.contentType);
      res.send(metrics);
    } catch (err) {
      next(err);
    }
  })

  const metricsPort = normalizePort(configProvider.get('metrics:port') || '3001');
  metricsServer.listen(metricsPort);
  console.info(colors.cyan(`⧉ Cluster metrics server listening to ${metricsPort}, metrics exposed on /metrics`));
} else {
  createConnection().then(async connection => {
    const app = new App();
    const port = normalizePort(configProvider.get('server:port') || '3333');
    app.start(port);

    app.eventCallback('error', (error: any) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
        default:
          throw error;
      }
    });

    app.eventCallback('listening', () => {
      debug(`Listening on ${configProvider.get('server:port')}`);
    });
  }).catch((error) => { throw error; });
}
