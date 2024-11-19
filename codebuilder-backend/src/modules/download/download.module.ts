import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [
    DownloadController
  ],
  providers: [
    DownloadService,
  ],
  exports: [
    DownloadService,
  ]
})
export class DownloadModule { }
