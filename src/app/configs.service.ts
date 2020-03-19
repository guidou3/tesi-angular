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
    console.log(parameters)
    this.http.post<Types.Parameters>(host+'/params', parameters, {
      responseType: 'text'
    })
      .subscribe(resp => console.log(resp))
  }

  public getInitialMapping() {
    return this.http.get<Types.InitialMapping>(host+'/initialMapping')
  }

  public postMapping(mapping: Types.Mapping) {
    return this.http.post<Types.Mapping>(host+'/finalMapping', mapping, {
      responseType: 'text'
    })
  }

  public getControlFlowCost() {
    return this.http.get<any>(host+'/controlFlowCost')
  }

  public postControlFlowCost(controlFlowCost) {
    return this.http.post<any>(host+'/controlFlowCost', controlFlowCost, {
      responseType: 'text'
    })
  }

  public getInitialVariableMapping() {
    return this.http.get<any>(host+'/initialVariableMapping')
  }
  
  public postVariableMapping(mapping: any) {
    return this.http.post<any>(host+'/postVariableMapping', mapping, {
      responseType: 'text'
    })
  }

  public getVariableMatchCost() {
    return this.http.get<any>(host+'/variableMatchCost')
  }
  
  public postVariableMatchCost(mapping: any) {
    return this.http.post<any>(host+'/variableMatchCost', mapping, {
      responseType: 'text'
    })
  }

  public getVariableBounds() {
    return this.http.get<any>(host+'/variableBounds')
  }
  
  public postVariableBounds(variableBounds: any) {
    return this.http.post<any>(host+'/variableBounds', variableBounds, {
      responseType: 'text'
    })
  }

  public queryConfiguration() {
    return this.http.get<any>(host+'/queryConfiguration')
  }

  public doBalancedDataConformance() {
    return this.http.get<any>(host+'/balancedDataConformance')
  }
  
}