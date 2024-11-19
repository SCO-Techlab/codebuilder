import { HttpErrorsService } from './../../../shared/http-error/http-errors.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Download } from "../model/download";
import { Injectable } from "@angular/core";
import { DownloadService } from "../download.service";
import { DownloadFolder } from './download.actions';
import { catchError, tap } from 'rxjs';

export class DownloadStateModel {
  download: Download;
  success: boolean;
  successMsg: string;
  errorMsg: string;
}

export const downloadStateDefault: DownloadStateModel = {
  download: null,
  success: false,
  successMsg: undefined,
  errorMsg: undefined,
};

@State<DownloadStateModel>({
  name: "download",
  defaults: downloadStateDefault,
})

@Injectable()
export class DownloadState {

  constructor(
    private readonly downloadService: DownloadService,
    private readonly translateService: TranslateService,
    private readonly httpErrorsService: HttpErrorsService,
  ) {}

  @Selector()
  static download(state: DownloadStateModel): Download {
    return state.download;
  }

  @Selector()
  static success(state: DownloadStateModel): boolean {
    return state.success;
  }

  @Selector()
  static successMsg(state: DownloadStateModel): string {
    return state.successMsg;
  }

  @Selector()
  static errorMsg(state: DownloadStateModel): string {
    return state.errorMsg;
  }

  @Action(DownloadFolder)
  public downloadFolder(
    { patchState }: StateContext<DownloadStateModel>,
    { payload }: DownloadFolder
  ) {
    return this.downloadService.downloadFolder(payload.folder).pipe(
      tap((download: Download) => {
        if (download) {
          patchState({
            download: download,
            success: true,
            successMsg: this.translateService.getTranslate('label.download.store.downloadFolder.success'),
          });
        } else {
          patchState({
            download: undefined,
            success: false,
            errorMsg: this.translateService.getTranslate('label.download.store.downloadFolder.error'),
          });
        }
      }),
      catchError((error) => {
        let errorMsg: string = this.translateService.getTranslate('label.download.store.downloadFolder.catch');
        if (this.httpErrorsService.getErrorMessage(error.error.message)) {
          errorMsg = this.httpErrorsService.getErrorMessage(error.error.message);
        }

        patchState({
          download: undefined,
          success: false,
          errorMsg: errorMsg,
        });

        throw new Error(error);
      })
    );
  }
}

