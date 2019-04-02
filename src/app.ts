import * as bodyParser from 'body-parser';
import { MainController } from './controllers';
import colors from 'colors/safe';
import { Server } from '@overnightjs/core';
import logger from 'morgan';
import { ErrorReporting } from '@google-cloud/error-reporting';
import promBundle from 'express-prom-bundle';
import { configProvider } from './providers';
const mainController = new MainController();
/*
const errors = new ErrorReporting({
  keyFilename: configProvider.get('errorReporting:keyFileName'),
  projectId: configProvider.get('errorReporting:id'),
  reportUnhandledRejections: true,
});*/

const metricsMiddleware = promBundle({
  buckets: [0.005, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0, 2.0, 3.0, 4.0, 5.0, 10, 30],
  includeMethod: true,
  includePath: true,
});

export class App extends Server {
  constructor() {
    super();
    this.setupExpress();
    this.setupControllers();
    // this.nodeProcess();
  }

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(colors.green(`☛ Server listening on port: ${port} 😄`));
    });
  }

  public eventCallback(event: any, callbackFunction: any) {
    process.on(event, callbackFunction);
  }

  private setupExpress(): void {
    // normal express config
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(
      logger(
        // tslint:disable-next-line:max-line-length
        ':date[iso] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'
      )
    );
    this.app.use(metricsMiddleware);
    //this.app.use(errors.express);
  }

  private setupControllers(): void {
    super.addControllers([mainController]);
  }

  private nodeProcess(): void {
    process.on('uncaughtException', (e) => {
      console.error(e);
      // errors.report(e);
      process.exit(1);
    });
  }
}
