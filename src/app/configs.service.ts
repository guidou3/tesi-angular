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

export class Parameters {
  algorithm: String
  balanced: Boolean
  cache: Boolean
  checked: Boolean
  fitness: number
  keep_control: Boolean
  keep_data: Boolean
  milp: String
  moves_ordering: String
  optimization: Boolean
  queueing: String
  search_space: number
  threads: number
  unassigned: String
}

@Injectable()
export class ConfigsService {

  constructor(private http: HttpClient) { }

  public getParameters() {
    return this.http.get<Params>(host+'/params')
  }

  public postParameters(parameters: Parameters) {
    this.http.post<Parameters>(host+'/params', parameters, {
      responseType: 'text'
    })
      .subscribe(resp => console.log(resp))
  }

  public getInitialMapping() {
    return this.http.get<Params>(host+'/initialMapping')
  }
}