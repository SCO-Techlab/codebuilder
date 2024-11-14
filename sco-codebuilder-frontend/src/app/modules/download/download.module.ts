import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from 'src/app/shared/shared.module';
import { DownloadService } from './download.service';
import { DownloadState } from './store/download.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature(
      [
        DownloadState,
      ]
    ),
    SharedModule,
  ],
  providers: [
    DownloadService,
  ],
})
export class DownloadModule { }
