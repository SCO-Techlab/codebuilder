import { registerAs } from "@nestjs/config";

export const APP_CONFIGURATION = registerAs('app', () => ({
  env: process.env.ENV_APP,
  port: parseInt(process.env.PORT_APP) || 3000,
  host: process.env.HOST_APP,
  production: process.env.PRODUCTION_APP == 'true',
  xamppPath: process.env.XAMPP_PATH_APP,
  sslPath: process.env.SSL_PATH,
  origin: process.env.ORIGIN_APP,
}));
