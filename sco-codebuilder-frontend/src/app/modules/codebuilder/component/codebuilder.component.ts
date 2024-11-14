import { cloneDeep } from 'lodash-es';
import { Store } from '@ngxs/store';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InitWritter } from '../model/init-writter.model';
import { Writter } from '../model/writter.model';
import { CreateWritterSpace, DesotryWritterSpace, WritteOnSpaceFiles } from '../store/codebuilder.actions';
import { CodebuilderState } from '../store/codebuilder.state';
import { ResolutionService } from 'src/app/shared/resolution/resolution.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { ConfigService } from 'src/app/shared/config/config.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { environment } from 'src/environments/environment';
import * as ace from "ace-builds";
import 'brace/mode/javascript';
import 'brace/mode/css';
import 'brace/mode/html';
import 'brace/theme/monokai';
import { ConsoleLog } from '../model/console-log';
import { CacheService } from 'src/app/shared/cache/cache.service';

@Component({
  selector: 'app-codebuilder',
  templateUrl: './codebuilder.component.html',
  styleUrls: ['./codebuilder.component.scss']
})
export class CodebuilderComponent implements OnInit, AfterViewInit, OnDestroy {

  /* CONTAINER TITLES */
  public title_content1: string;
  public title_content2: string;
  public title_content3: string;

  /* TEXT EDITORS (WEB || MOBILE / TABLET) */
  @ViewChild('htmlEditorWeb') htmlEditorWeb: ElementRef;
  public htmlEditor_WEB: any;
  @ViewChild('htmlEditorTabletMobile') htmlEditorTabletMobile: ElementRef;
  public htmlEditor_TABLET_MOBILE: any;
  @ViewChild('cssEditorWeb') cssEditorWeb: ElementRef;
  public cssEditor_WEB: any;
  @ViewChild('cssEditorTabletMobile') cssEditorTabletMobile: ElementRef;
  public cssEditor_TABLET_MOBILE: any;
  @ViewChild('javascriptEditorWeb') javascriptEditorWeb: ElementRef;
  public jsEditor_WEB: any;
  @ViewChild('javascriptEditorTabletMobile') javascriptEditorTabletMobile: ElementRef;
  public jsEditor_TABLET_MOBILE: any;

  /* RESULT API URL */
  public safeSrc: SafeResourceUrl;

  /* START WRITTER DATA */
  public InitWritter: InitWritter;

  /* CURRENT APP RESOLUTION MOODE */
  public appType: string;
  public initAppType: string;

  /* TYPE OF CONTAINER SELECTED (TABLET / MOBILE) */
  public typeSelected: string;

  /* Console logs */
  public showLogs: boolean;
  public consoleLogs: ConsoleLog[];
  
  constructor(
    private readonly store: Store,
    private readonly sanitizer: DomSanitizer,
    private readonly spinnerService: SpinnerService,
    private readonly toastService: ToastService,
    private readonly cacheService: CacheService,
    public readonly configService: ConfigService,
    public readonly translateService: TranslateService,
    public readonly resolutionService: ResolutionService,
  ) {  
    this.appType = this.resolutionService.getMode();
    this.initAppType = this.appType;
    this.title_content1 = 'HTML';
    this.title_content2 = 'CSS';
    this.title_content3 = "JS";
    this.typeSelected = this.title_content1;
    this.InitWritter = new InitWritter();

    this.showLogs = false;
    this.consoleLogs = [];
    window.addEventListener('message', e => {
      const data = e.data
      if (data.type === 'log' || data.type === 'error') {
        const color: string = data.type === 'log' ? '#17a2b8' : '#f44336';
        this.consoleLogs.push({ type: data.type, message: data.args, color: color });
      }
    });
  }

  /* INIT WRITTER */
  ngOnInit(): void {
    this.store.dispatch(new CreateWritterSpace({ initWritter: this.InitWritter })).subscribe({
      next: () => {
        this.spinnerService.hideSpinner();

        const success = this.store.selectSnapshot(CodebuilderState.success);
        if (!success) {
          this.toastService.addErrorMessage('Initwritter.error');
          return;
        }

        const initWritter: InitWritter = this.store.selectSnapshot(CodebuilderState.iniWritter);
        this.InitWritter = cloneDeep(initWritter); 
        
        this.getUrl();
      },
      error: () => {
        this.spinnerService.hideSpinner();
        this.toastService.addErrorMessage('Initwritter.error');
      }
    });
  }
  
  /* LOAD TEXT EDITORS */
  async ngAfterViewInit(): Promise<void> {
    /* Content 1 editors */
    // HTML
    this.htmlEditor_WEB = ace.edit(this.htmlEditorWeb.nativeElement);
    /* this.htmlEditor_WEB.getSession().setMode('ace/mode/html'); */
    this.htmlEditor_WEB.setTheme('ace/theme/monokai');
    this.htmlEditor_WEB.setOptions({
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
      useWorker: false,
      mode: 'ace/mode/html',
    });

    this.htmlEditor_TABLET_MOBILE = ace.edit(this.htmlEditorTabletMobile.nativeElement);
    /* this.htmlEditor_TABLET_MOBILE.getSession().setMode('ace/mode/html'); */
    this.htmlEditor_TABLET_MOBILE.setTheme('ace/theme/monokai');
    this.htmlEditor_TABLET_MOBILE.setOptions({
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
      useWorker: false,
      mode: 'ace/mode/html',
    });

    /* Content 2 editors */
    // CSS
    this.cssEditor_WEB = ace.edit(this.cssEditorWeb.nativeElement);
    /* this.cssEditor_WEB.getSession().setMode('ace/mode/css'); */
    this.cssEditor_WEB.setTheme('ace/theme/monokai');
    this.cssEditor_WEB.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      useWorker: false,
      mode: 'ace/mode/css',
    });
    
    this.cssEditor_TABLET_MOBILE = ace.edit(this.cssEditorTabletMobile.nativeElement);
    /* this.cssEditor_TABLET_MOBILE.getSession().setMode('ace/mode/css'); */
    this.cssEditor_TABLET_MOBILE.setTheme('ace/theme/monokai');
    this.cssEditor_TABLET_MOBILE.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      useWorker: false,
      mode: 'ace/mode/css',
    });

    /* Content 3 editors */
    // JS
    this.jsEditor_WEB = ace.edit(this.javascriptEditorWeb.nativeElement);
    /* this.jsEditor_WEB.getSession().setMode('ace/mode/javascript'); */
    this.jsEditor_WEB.setTheme('ace/theme/monokai');
    this.jsEditor_WEB.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      useWorker: false,
      mode: 'ace/mode/javascript',
    });

    this.jsEditor_TABLET_MOBILE = ace.edit(this.javascriptEditorTabletMobile.nativeElement);
    /* this.jsEditor_TABLET_MOBILE.getSession().setMode('ace/mode/javascript'); */
    this.jsEditor_TABLET_MOBILE.setTheme('ace/theme/monokai');
    this.jsEditor_TABLET_MOBILE.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      useWorker: false,
      mode: 'ace/mode/javascript',
    });    

    /* Load Example Code */
    if (this.cacheService.getElement('codebuilder-example')) {
      if (this.appType == 'web') {
        this.htmlEditor_WEB.setValue(this.cacheService.getElement('codebuilder-example-html'));
        this.cssEditor_WEB.setValue(this.cacheService.getElement('codebuilder-example-css'));
        this.jsEditor_WEB.setValue(this.cacheService.getElement('codebuilder-example-js'));
      } else {
        this.htmlEditor_TABLET_MOBILE.setValue(this.cacheService.getElement('codebuilder-example-html'));
        this.cssEditor_TABLET_MOBILE.setValue(this.cacheService.getElement('codebuilder-example-css'));
        this.jsEditor_TABLET_MOBILE.setValue(this.cacheService.getElement('codebuilder-example-js'));
      }
      this.cacheService.setElement('codebuilder-example', false);
    }
  }

  /* DESTROY WRITTER */
  async ngOnDestroy(): Promise<void> {
    this.store.dispatch(new DesotryWritterSpace({ initWritter: this.InitWritter })).subscribe({
      next: () => {
        this.spinnerService.hideSpinner();

        const success = this.store.selectSnapshot(CodebuilderState.success);
        if(!success) {
          this.toastService.addErrorMessage('.destroyWritter.error');
          return;
        }
      },
      error: (err) => {
        this.spinnerService.hideSpinner();
        this.toastService.addErrorMessage('.destroyWritter.error');
      }
    });
  }

  /* RUN CODE */
  onClickRunBtn() {
    this.spinnerService.showSpinner();
    this.consoleLogs = [];

    let writterDto: Writter = new Writter();
    writterDto.token = this.InitWritter.token;
    writterDto.html = this.appType == 'web' ? this.htmlEditor_WEB.getValue() : this.htmlEditor_TABLET_MOBILE.getValue();
    writterDto.css = this.appType == 'web' ? this.cssEditor_WEB.getValue() : this.cssEditor_TABLET_MOBILE.getValue();
    writterDto.js = this.appType == 'web' ? this.jsEditor_WEB.getValue() : this.jsEditor_TABLET_MOBILE.getValue();

    this.store.dispatch(new WritteOnSpaceFiles({ writter: writterDto })).subscribe({
      next: () => {
        const success = this.store.selectSnapshot(CodebuilderState.success);
        if (!success) {
          this.spinnerService.hideSpinner();
          this.toastService.addErrorMessage('writte.error');
          return;
        }

        setTimeout(() => {
          this.getUrl();
        }, 2000);
      },
      error: () => {
        this.spinnerService.hideSpinner();
        this.toastService.addErrorMessage('writte.error');
      }
    });
  }

  /* MOBILE / TABLET ACTIONS */
  async changeMode(type: string) {
    this.typeSelected = type;
  }

  /* HOST LISTENERS */
  @HostListener('window:beforeunload', ['$event'])
  async onBeforeUnload(): Promise<void> {
    await this.ngOnDestroy();
  }

  @HostListener('window:resize', ['$event'])
  async onResize() {
    let width: number = window.innerWidth; // Current redimensioned window width
    let currentType: string = this.resolutionService.getMode(width);

    // Change Text Editors Values
    if (currentType == "web" && this.appType != "web") {  
      this.htmlEditor_WEB.setValue(this.htmlEditor_TABLET_MOBILE.getValue());
      this.cssEditor_WEB.setValue(this.cssEditor_TABLET_MOBILE.getValue());
      this.jsEditor_WEB.setValue(this.jsEditor_TABLET_MOBILE.getValue());
      this.appType = currentType;
    }

    if (currentType == "tablet" && (this.appType != "tablet" && this.appType != "mobile" )) {
      this.htmlEditor_TABLET_MOBILE.setValue(this.htmlEditor_WEB.getValue());
      this.cssEditor_TABLET_MOBILE.setValue(this.cssEditor_WEB.getValue());
      this.jsEditor_TABLET_MOBILE.setValue(this.jsEditor_WEB.getValue());
      this.appType = currentType;
    }

    if (currentType == "mobile" && (this.appType != "tablet" && this.appType != "mobile" )) {
      this.htmlEditor_TABLET_MOBILE.setValue(this.htmlEditor_WEB.getValue());
      this.cssEditor_TABLET_MOBILE.setValue(this.cssEditor_WEB.getValue());
      this.jsEditor_TABLET_MOBILE.setValue(this.jsEditor_WEB.getValue());
      this.appType = currentType;
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.ctrlKey && event.code == 'Enter') {
      this.onClickRunBtn();
    }
  }

  private getUrl() {
    const https: string = `${environment.httpsEnabled ? 'https://' : 'http://'}`;
    if (environment.production) {
      this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(
        `${https}${environment.host}:${environment.xamppPort}/public/codebuilder/${this.InitWritter.token}/index.html`
      );
      this.spinnerService.hideSpinner();
      return;
    }

    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(
      `http://${environment.host}:${environment.xamppPort}/codebuilder/${this.InitWritter.token}/index.html`
    );
    this.spinnerService.hideSpinner();
  }

  changeViewMode() {
    if (this.appType == 'mobile' || this.appType == 'tablet') {
      this.htmlEditor_WEB.setValue(this.htmlEditor_TABLET_MOBILE.getValue());
      this.cssEditor_WEB.setValue(this.cssEditor_TABLET_MOBILE.getValue());
      this.jsEditor_WEB.setValue(this.jsEditor_TABLET_MOBILE.getValue());

      this.appType = 'web';
    } else {
      this.htmlEditor_TABLET_MOBILE.setValue(this.htmlEditor_WEB.getValue());
      this.cssEditor_TABLET_MOBILE.setValue(this.cssEditor_WEB.getValue());
      this.jsEditor_TABLET_MOBILE.setValue(this.jsEditor_WEB.getValue());

      this.appType = 'mobile';
    }
  }
}
