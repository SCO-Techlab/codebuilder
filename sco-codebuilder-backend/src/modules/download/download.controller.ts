import { httpErrorMessages } from 'src/constants/http-error-messages.constants';
import { Controller, Get, HttpException, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DownloadService } from './download.service';
import { DownloadDto } from './dto/download.dto';

@Controller(`api/v1/download`)
export class DownloadController {

  constructor(private readonly downloadService: DownloadService) {}

  @Get('downloadFolder/:folder')
  async downloadFolder(
    @Res() res: Response, 
    @Param('folder') folder: string,
  ): Promise<Response<DownloadDto, Record<string, DownloadDto>>> {
    const existPath: boolean = await this.downloadService.exists(folder);
    if (!existPath) {
      console.log(`[downloadFolder] Folder '${folder}' not exists`);
      throw new HttpException(httpErrorMessages.DOWNLOAD.DOWNLOAD_FOLDER_NOT_EXISTS, HttpStatus.CONFLICT);
    }

    const files: string[] = await this.downloadService.listFiles(folder);
    if (!files || (files && files.length == 0)) {
      console.log(`[downloadFolder] Folder '${folder}' not cotains files`);
      throw new HttpException(httpErrorMessages.DOWNLOAD.DOWNLOAD_FOLDER_NO_FILES, HttpStatus.CONFLICT);
    }

    const downloadDto: DownloadDto = await this.downloadService.downloadFolder(folder, files);
    if (!downloadDto) {
      console.log(`[downloadFolder] Folder '${folder}' unnable to create download file`);
      throw new HttpException(httpErrorMessages.DOWNLOAD.UNNABLE_CREATE_DOWNLOAD_FILE, HttpStatus.CONFLICT);
    }
    
    return res.status(200).json(downloadDto);
  }
}