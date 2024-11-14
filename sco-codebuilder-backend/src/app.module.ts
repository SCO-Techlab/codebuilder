import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from './modules/logger/logger.module';
import { configurationApp } from './configuration/configuration-app';
import { configurationWebsocket } from './configuration/configuration-websocket';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { WebsocketConfig } from './modules/websocket/config/websocket-config';
import { PublicMiddleware } from './middlewares/public.middleware';
import { WritterModule } from './modules/writter/writter.module';
import { DownloadModule } from './modules/download/download.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        configurationApp,
        configurationWebsocket,
      ],
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    WebsocketModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const websocketConfig: WebsocketConfig = {
          port: configService.get('websocket.port'),
          origin: configService.get('websocket.origin'),
        };
        return websocketConfig;
      },
      inject: [ConfigService],
    }),
    LoggerModule,
    WritterModule,
    DownloadModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(PublicMiddleware).forRoutes("*");
  }
}