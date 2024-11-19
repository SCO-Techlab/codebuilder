import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_CONFIGURATION } from './app.configuration';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { WebsocketConfig } from './modules/websocket/websocket-config';
import { PublicMiddleware } from './middlewares/public.middleware';
import { WritterModule } from './modules/writter/writter.module';
import { DownloadModule } from './modules/download/download.module';
import { LoggerService } from './app.logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ APP_CONFIGURATION ],
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    WebsocketModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const websocketConfig: WebsocketConfig = {
          port: configService.get('app.port'),
        };
        return websocketConfig;
      },
      inject: [ConfigService],
    }),
    WritterModule,
    DownloadModule,
  ],
  providers: [
    LoggerService,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(PublicMiddleware).forRoutes("*");
  }
}