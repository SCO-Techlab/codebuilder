import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './app.logger.service';
import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { WebsocketAdapter } from './modules/websocket/websocket-adapter';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

async function bootstrap() {

  const basepath: string = `${process.env.SSL_PATH}/${process.env.HOST_APP}`;

  let cert: any = undefined;
  if (fs.existsSync(`${basepath}/fullchain.pem`)) {
    console.log(`Cert: ${basepath}/fullchain.pem found`);
    cert = fs.readFileSync(`${basepath}/fullchain.pem`);
  }

  let key: any = undefined;
  if (fs.existsSync(`${basepath}/privkey.pem`)) {
    console.log(`Key: ${basepath}/privkey.pem found`);
    key = fs.readFileSync(`${basepath}/privkey.pem`);
  }

  const httpsEnabled: boolean = key && cert ? true : false;
  const app = await NestFactory.create(AppModule, 
    { 
      logger: new LoggerService(),
      httpsOptions: !httpsEnabled ? undefined : { key: key, cert: cert },
    }
  );

  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = Object.values(validationErrors[0].constraints).join(',');
        const splitErrors: string[] = errors.split(',');
        throw new HttpException(splitErrors[splitErrors.length-1], HttpStatus.BAD_REQUEST);
      },
    }),
  );

  const origin: string[] = formatOrigin(configService.get('app.origin')) || [];
  app.enableCors({
    origin: origin && origin.length > 0 ? origin : '*',
    credentials: true,
  });

  app.useWebSocketAdapter(new WebsocketAdapter(app, origin));
  
  const port: number = configService.get('app.port') || 3000;
  const host: string = configService.get('app.host') || 'localhost';

  await app.listen(port);
  console.log(`[bootstrap] App started in '${httpsEnabled ? 'https' : 'http'}://${host}:${port}'`);
}
bootstrap();

function formatOrigin(envOrigin: string): string[] {
  if (!envOrigin || envOrigin && envOrigin.length == 0) return ["*"];
  const origin: string[] = envOrigin.includes(',')
    ? envOrigin.split(',')
    : [envOrigin];
  return origin;
}