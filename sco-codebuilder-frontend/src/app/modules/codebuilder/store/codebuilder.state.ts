import { HttpErrorsService } from './../../../shared/http-error/http-errors.service';
import { CodebuilderService } from './../codebuilder.service';
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, tap } from "rxjs/operators";
import { InitWritter } from '../model/init-writter.model';
import { Writter } from '../model/writter.model';
import { CreateWritterSpace, DesotryWritterSpace, WritteOnSpaceFiles } from './codebuilder.actions';
import { TranslateService } from 'src/app/shared/translate/translate.service';

export class CodebuilderStateModel {
  initWritter: InitWritter;
  writter: Writter;
  success: boolean;
  notifyChangeCodebuilder: boolean;
  successMsg: string;
  errorMsg: string;
}

export const CodebuilderStateDefault: CodebuilderStateModel = {
    initWritter: null,
    writter: null,
    success: false,
    notifyChangeCodebuilder: false,
    successMsg: undefined,
    errorMsg: undefined,
};

@State<CodebuilderStateModel>({
  name: "codebuilder",
  defaults: CodebuilderStateDefault,
})

@Injectable()
export class CodebuilderState {

  constructor(
    private readonly codebuilderService: CodebuilderService,
    private readonly translateService: TranslateService,
    private readonly httpErrorsService: HttpErrorsService,
  ) {}

  @Selector()
  static iniWritter(state: CodebuilderStateModel): InitWritter {
    return state.initWritter;
  }

  @Selector()
  static writter(state: CodebuilderStateModel): Writter {
    return state.writter;
  }

  @Selector()
  static success(state: CodebuilderStateModel): boolean {
    return state.success;
  }

  @Selector()
  static notifyChangeCodebuilder(state: CodebuilderStateModel): boolean {
    return state.notifyChangeCodebuilder;
  }

  @Selector()
  static successMsg(state: CodebuilderStateModel): string {
    return state.successMsg;
  }

  @Selector()
  static errorMsg(state: CodebuilderStateModel): string {
    return state.errorMsg;
  }

  @Action(CreateWritterSpace)
  public createWritterSpace(
    { patchState }: StateContext<CodebuilderStateModel>,
    { payload }: CreateWritterSpace
  ) {
    return this.codebuilderService.createWritterSpace(payload.initWritter).pipe(
      tap((initWritter: InitWritter) => {
        if (initWritter && initWritter.result) {
          patchState({
            initWritter: initWritter,
            success: true,
            successMsg: this.translateService.getTranslate('label.codebuilder.store.initWritter.success'),
          });
        } else {
          patchState({
            initWritter: initWritter,
            success: false,
            successMsg: this.translateService.getTranslate('label.codebuilder.store.initWritter.error'),
          });
        }
      }),
      catchError((error) => {
        let errorMsg: string = this.translateService.getTranslate('label.codebuilder.store.initWritter.error');
        if (this.httpErrorsService.getErrorMessage(error.error.message)) {
          errorMsg = this.httpErrorsService.getErrorMessage(error.error.message);
        }

        patchState({
          initWritter: undefined,
          success: false,
          errorMsg: errorMsg,
        });

        throw new Error(error);
      })
    );
  }

  @Action(WritteOnSpaceFiles)
  public writteOnSpaceFiles(
    { patchState }: StateContext<CodebuilderStateModel>,
    { payload }: WritteOnSpaceFiles
  ) {
    return this.codebuilderService.writteOnSpaceFiles(payload.writter).pipe(
      tap((result: boolean) => {
        if (result) {
          patchState({
            success: true,
            successMsg: this.translateService.getTranslate('label.codebuilder.store.writte.success'),
          });
        } else {
          patchState({
            success: false,
            errorMsg: this.translateService.getTranslate('label.codebuilder.store.writte.error'),
          });
        }
      }),
      catchError((error) => {
        let errorMsg: string = this.translateService.getTranslate('label.codebuilder.store.writte.error');
        if (this.httpErrorsService.getErrorMessage(error.error.message)) {
          errorMsg = this.httpErrorsService.getErrorMessage(error.error.message);
        }

        patchState({
          success: false,
          errorMsg: errorMsg,
        });

        throw new Error(error);
      })
    );
  }

  @Action(DesotryWritterSpace)
  public desotryWritterSpace(
    { patchState }: StateContext<CodebuilderStateModel>,
    { payload }: DesotryWritterSpace
  ) {
    return this.codebuilderService.desotryWritterSpace(payload.initWritter).pipe(
      tap((result: boolean) => {
        if (result) {
          patchState({
            success: true,
            successMsg: this.translateService.getTranslate('label.codebuilder.store.destroyWritter.success'),
          });
        } else {
          patchState({
            success: false,
            successMsg: this.translateService.getTranslate('label.codebuilder.store.destroyWritter.error'),
          });
        }
      }),
      catchError((error) => {
        let errorMsg: string = this.translateService.getTranslate('label.codebuilder.store.destroyWritter.error');
        if (this.httpErrorsService.getErrorMessage(error.error.message)) {
          errorMsg = this.httpErrorsService.getErrorMessage(error.error.message);
        }

        patchState({
          success: false,
          errorMsg: errorMsg,
        });

        throw new Error(error);
      })
    );
  }
}

