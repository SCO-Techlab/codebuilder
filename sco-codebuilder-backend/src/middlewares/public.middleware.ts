
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as path from 'path';

const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
  '.mp4',
  '.mp3',
  '.gif',
  '.txt',
  '.html',
  '.csv',
  '.xml',
  '.pdf',
];

const resolvePath = (file: string) => path.resolve(`./public/${file}`);

export class MiddlewareData {
  baseUrl: string;
}

@Injectable()
export class PublicMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const middlewareData: MiddlewareData = req;

    if (middlewareData.baseUrl.indexOf(`api/v1`) === 1) {
      // it starts with /api --> continue with execution
      next();
    } else if (middlewareData.baseUrl.indexOf(`public/`) === 1) {
      // it is a file previously uploaded
      const formatUrl: string = this.formatPublicUrl(middlewareData.baseUrl);
      res.sendFile(resolvePath(formatUrl));
    } else if (allowedExt.filter(ext => middlewareData.baseUrl.indexOf(ext) > 0).length > 0) {
      // it has a file extension --> resolve the file
      res.sendFile(resolvePath(middlewareData.baseUrl));
    } else {
      // in all other cases, redirect to the index.html!
      res.sendFile(resolvePath('index.html'));
    }
  }

  private formatPublicUrl(baseUrl: string): string {
    const splitUrl: string[] = baseUrl.split("/");

    let urlFormated: string = '/';
    for (let i = 0; i < splitUrl.length; i++) {
      if (i == 0 || i == 1) {
        continue;
      }

      urlFormated += `${splitUrl[i]}/`;
    }

    urlFormated = urlFormated.substring(0, urlFormated.length-1);

    return urlFormated;
  }
}
