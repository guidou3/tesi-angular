import { Injectable } from '@angular/core';
import {host} from '../net.json'
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

export interface Params {
  maxThreads: number;
  maxSearchSpace: number;
  defaultSearchSpace: number;
}

@Injectable()
export class ConfigsService {

  constructor(private http: HttpClient) { }

  public getParameters() {
    return this.http.get<Params>(host+'/params')
  }
}