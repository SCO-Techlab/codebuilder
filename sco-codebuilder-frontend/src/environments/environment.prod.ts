export const environment = {
  name: 'prod',
  production: true,
  host: 'codebuilder.sco-techlab.es',
  apiUrl: `http://codebuilder.sco-techlab.es:3200/api/v1`,
  socketUrl: `ws://codebuilder.sco-techlab.es:3201`,
  httpsEnabled: true,
  xamppPort: 3200,
};

environment.apiUrl = !environment.httpsEnabled
  ? environment.apiUrl
  : environment.apiUrl.replace('http', 'https');

  environment.socketUrl = !environment.httpsEnabled
  ? environment.socketUrl
  : environment.socketUrl.replace('ws', 'wss');