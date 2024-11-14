import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '../shared/translate/translate.service';

@Injectable({ providedIn: 'root' })
export class HeadersInterceptor implements HttpInterceptor {

  constructor(private readonly translateService: TranslateService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lang: string = this.translateService.getLanguage() || this.translateService.translateConstants.DEFAULT_LANGUAGE;

    try {
      request = request.clone({
        setHeaders: {
          ClientLanguage: lang,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      return next.handle(request);
    }
  }
}
