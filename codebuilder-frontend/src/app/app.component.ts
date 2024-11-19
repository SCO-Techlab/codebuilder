import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { WebSocketService } from "./websocket/websocket.service";
import { SpinnerService } from "./shared/spinner/spinner.service";
import { ResolutionService } from './shared/resolution/resolution.service';
import { Select, Store } from "@ngxs/store";
import { CodebuilderState } from "./modules/codebuilder/store/codebuilder.state";
import { InitWritter } from "./modules/codebuilder/model/init-writter.model";
import { Observable } from "rxjs";
import { DownloadFolder } from "./modules/download/store/download.actions";
import { ToastService } from "./shared/toast/toast.service";
import { DownloadState } from "./modules/download/store/download.state";
import { Download } from "./modules/download/model/download";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('header') header: ElementRef;
  @ViewChild('content') content: ElementRef;
  public contentHeight: number;

  @Select(CodebuilderState.iniWritter) iniWritter$: Observable<InitWritter>;
  iniWritter: InitWritter;

  constructor(
    private readonly store: Store,
    private readonly websocketsService: WebSocketService,
    private readonly toastService: ToastService,
    public readonly spinnerService: SpinnerService,
    public readonly resolutionService: ResolutionService,
  ) {

    this.websocketsService.connect();

    this.iniWritter$.subscribe((iniWritter: InitWritter) => {
      this.iniWritter = iniWritter;
    });
  }

  ngAfterViewInit(): void {
    this.calculateSizes();
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.calculateSizes($event.target.innerHeight);
  }

  onDownloadFolder() {
    this.store.dispatch(new DownloadFolder({ folder: this.iniWritter.token })).subscribe({
      next: () => {
        if (!this.store.selectSnapshot(DownloadState.success)) 
          return this.toastService.addErrorMessage(this.store.selectSnapshot(DownloadState.errorMsg));

        const download: Download = this.store.selectSnapshot(DownloadState.download);
        if (!download) return this.toastService.addErrorMessage(this.store.selectSnapshot(DownloadState.errorMsg));

        try {
          const a = document.createElement('a');
          a.href = `data:text/csv;base64,${download.base64}`
          a.download = download.fileName
          a.click();
          this.toastService.addSuccessMessage(this.store.selectSnapshot(DownloadState.successMsg));
        } catch (error) {
          this.toastService.addErrorMessage(this.store.selectSnapshot(DownloadState.errorMsg));
        }
      },
      error: () => {
        this.toastService.addErrorMessage(this.store.selectSnapshot(DownloadState.errorMsg));
      }
    })
  }

  private calculateSizes(height: number = undefined): void {
    if (!height) height = window.innerHeight;
    this.contentHeight = height - this.header.nativeElement.offsetHeight;
  }
}
