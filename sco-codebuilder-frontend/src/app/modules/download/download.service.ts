import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Download } from './model/download';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private readonly http: HttpClient) {}
  
  downloadFolder(folder: string): Observable<Download> {
    return this.http.get<Download>(`${environment.apiUrl}/download/downloadFolder/${folder}`);
  }
}
