import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { InitWritter } from './model/init-writter.model';
import { Writter } from "./model/writter.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CodebuilderService {
  constructor(private readonly http: HttpClient) {}
  
  createWritterSpace(iniWritter: InitWritter): Observable<InitWritter> {
    return this.http.post<InitWritter>(environment.apiUrl + "/writter/init", iniWritter);
  }

  writteOnSpaceFiles(writter: Writter): Observable<boolean> {
    return this.http.post<boolean>(environment.apiUrl + "/writter/writte", writter);
  }

  desotryWritterSpace(iniWritter: InitWritter): Observable<boolean> {
    return this.http.post<boolean>(environment.apiUrl + "/writter/destroy", iniWritter);
  }
}