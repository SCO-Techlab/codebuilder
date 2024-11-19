import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import * as fs from 'fs';

@Injectable()
export class WritterService {

  private _xamppPath: string;

  constructor(private readonly configService: ConfigService) {
    this._xamppPath = this.configService.get('app.xamppPath');
  }

  /* Format Text */
  public async formatHtmlPage(html: string): Promise<string> {
    let htmlLines: string[] = [];
    if (html && html.length > 0) {
      htmlLines = html.split("\n");
    }

    let htmlData: string = '';
    htmlData += '<html> \n';
    htmlData += ' <head> \n';
    htmlData += '   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css" rel="nofollow" integrity="sha384-r4NyP46KrjDleawBgD5tp8Y7UzmLA05oM1iAEQ17CSuDqnUK2+k9luXQOfXJCJ4I" crossorigin="anonymous"> \n';
    htmlData += '   <link rel="stylesheet" href="index.css"> \n';
    htmlData += ' </head> \n';
    htmlData += ' <body> \n';

    if (htmlLines && htmlLines.length > 0) {
      htmlLines.forEach(line => {
        htmlData += '   ' + line + "\n";
      });
    }

    htmlData += '\n';
    htmlData += '   <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script> \n';
    htmlData += '   <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js" integrity="sha384-oesi62hOLfzrys4LxRF63OJCXdXDipiYWBnvTl9Y9/TRlw5xlKIEHpNyvvDShgf/" crossorigin="anonymous"></script>\n'
    htmlData += '   <script src="index.js"></script> \n';
    htmlData += ' </body> \n';
    htmlData += '</html> \n';

    return htmlData;
  }

  public async formatJavascriptPage(js: string): Promise<string> {
    let jsLines: string[] = [];
    if (js && js.length > 0) {
      jsLines = js.split("\n");
    }

    let jsData: string = '';
    jsData += `const originalLog = console.log; \n`;
    jsData += `console.log = (...args) => { \n`;
    jsData += `  parent.window.postMessage({ type: 'log', args: args }, '*') \n`;
    jsData += `  originalLog(...args) \n`;
    jsData += `}; \n`;
    jsData += `const originalLogError = console.error; \n`;
    jsData += `console.error = (...args) => { \n`;
    jsData += `  parent.window.postMessage({ type: 'error', args: args }, '*') \n`;
    jsData += `  originalLogError(...args) \n`;
    jsData += `}; \n`;

    jsData += `try { \n`;
    
    if (jsLines && jsLines.length > 0) {
      jsLines.forEach(line => {
        jsData += '   ' + line + "\n";
      });
    }

    jsData += `} catch (error) { \n`;
    jsData += `    const split = error.stack.toString().split("at"); \n`;
    jsData += `    console.error(split[0]); \n`;
    jsData += `} \n`;
    

    return jsData;
  }

  /* Files */
  public async writeFile(token: string, file: string, value: string = undefined): Promise<boolean> {
    const writeValue: string = value == undefined ? '' : value;

    const result: boolean = await new Promise<boolean>((resolve) => {
      fs.writeFile(
        `${this._xamppPath}/${token}/${file}`, 
        writeValue, 
        (err) => {
          if (err) resolve(false);
          resolve(true);
        }
      );
    });

    return result;
  }

  public async existFile(token: string, file: string): Promise<boolean> {
    if (fs.existsSync(`${this._xamppPath}/${token}/${file}`)) {
      return true;
    }

    return false;
  }

  /* Token Folder */
  public async createTokenFolder(token: string): Promise<boolean> {
    fs.mkdirSync(`${this._xamppPath}/${token}`);
    if (await this.existsTokenFolder(token)) {
      return true;
    }
    return false;
  }

  public async existsTokenFolder(token: string): Promise<boolean> {
    if (fs.existsSync(`${this._xamppPath}/${token}`)) {
      return true;
    }
    return false;
  }

  public async deleteTokenFolder(token: string): Promise<boolean> {
    const deleteOptions: fs.RmOptions = { recursive: true, force: true };
    
    fs.rmSync(`${this._xamppPath}/${token}`, deleteOptions);
    
    if (await this.existsTokenFolder(token)) {
      return false;
    }
    
    return true;
  }

  /* Server */
  public async createServerFolder(): Promise<boolean> {
    if (fs.existsSync(this._xamppPath)) {
      return true;
    }

    fs.mkdirSync(this._xamppPath);
    if (fs.existsSync(this._xamppPath)) {
      return true;
    }
    return false;
  }

  public async existServerFolder(): Promise<boolean> {
    if (fs.existsSync(`${this._xamppPath}`)) {
      return true;
    }
    return false;
  }

  /* Token */
  public async generateInitWritterToken(length: number = 64): Promise<string> {
    const possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let existTokenFolder: boolean = true;
    let text: string = "";
    while (existTokenFolder) {
      for (let i: number = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      existTokenFolder = await this.existsTokenFolder(text);
    }

    return text;
  }
}
