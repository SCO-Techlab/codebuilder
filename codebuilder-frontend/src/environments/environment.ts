export const environment = {
  name: 'dev',
  production: false,
  host: 'localhost',
  apiUrl: `http://localhost:3000/api/v1`,
  socketUrl: `ws://localhost:3000`,
  httpsEnabled: false,
  xamppPort: 80,
};

environment.apiUrl = !environment.httpsEnabled
  ? environment.apiUrl
  : environment.apiUrl.replace('http', 'https');

  environment.socketUrl = !environment.httpsEnabled
  ? environment.socketUrl
  : environment.socketUrl.replace('ws', 'wss');