import { Injectable } from '@angular/core';
import {host} from '../net.json'
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import * as Types from './Types'

@Injectable()
export class ConfigsService {

  constructor(private http: HttpClient) { }

  public getParameters() {
    return this.http.get<Types.DefaultSettings>(host+'/params')
  }

  public postParameters(parameters: Types.Parameters) {
    this.http.post<Types.Parameters>(host+'/params', parameters, {
      responseType: 'text'
    })
      .subscribe(resp => console.log(resp))
  }

  public getInitialMapping() {
    return this.http.get<Types.Mapping>(host+'/initialMapping')
  }

  public postMapping(mapping: Types.Mapping) {
    this.http.post<Types.Mapping>(host+'/finalMapping', mapping, {
      responseType: 'text'
    })
      .subscribe(resp => console.log(resp))
  }
}