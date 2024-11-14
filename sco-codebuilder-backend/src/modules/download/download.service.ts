
import { Injectable } from "@nestjs/common";
import { DownloadDto } from "./dto/download.dto";
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DownloadService {

  private _serverPath: string;

  constructor(private readonly configService: ConfigService) { }

  async onModuleInit() {
    this._serverPath = this.configService.get('app.xamppPath');
  }

  async exists(folder: string): Promise<boolean> {
    return fs.existsSync(`${this._serverPath}/${folder}`);
  }

  async listFiles(folder: string): Promise<string[]> {
    const list: string[] = await new Promise<string[]>((resolve) => {
      fs.readdir(`${this._serverPath}/${folder}`, (err, files) => {
        let response: string[] = [];

          if (!files || (files && files.length == 0)) {
            return resolve([]);
          }

          for (const file of files) {
            response.push(file);
          }
          
          return resolve(response);
      });
    });

    return list;
  }

  async downloadFolder(folder: string, files: string[]): Promise<DownloadDto> {
    const zipName: string = `${folder}.zip`;
    
    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = fs.createWriteStream(`${this._serverPath}/${folder}/${zipName}`);
    archive.pipe(output)

    for (const file of files) {
      const fileDetails = fs.lstatSync(path.resolve(`${this._serverPath}/${folder}`, file));
      if (fileDetails.isDirectory()) {
        archive.directory(`${this._serverPath}/${folder}/${file}`, file);
      } else {
        archive.append(fs.createReadStream(`${this._serverPath}/${folder}/${file}`), { name: file });
      }
    }

    archive.finalize()

    const downloadPath: string = `${this._serverPath}/${folder}`;
    const downloadDto: DownloadDto = await new Promise<DownloadDto>((resolve) => {
      output.on('close', function() {
        const folderBase64: string = fs.readFileSync(`${downloadPath}/${zipName}`, { encoding: 'base64' });
        if (fs.existsSync(`${downloadPath}/${zipName}`)) {
          fs.rmSync(`${downloadPath}/${zipName}`, { recursive: true, force: true });
        }
        
        return resolve({
          fileName: zipName,
          fileType: 'zip',
          filePath: `${downloadPath}`,
          base64: folderBase64,
        });
      });
    });

    return downloadDto;
  }
}
