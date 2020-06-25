import { Injectable } from '@angular/core';
import {host} from '../net.json'
import { timeout } from 'rxjs/operators';
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
    return this.http.get<any>(host+'/initialMapping')
  }

  public postMapping(mapping) {
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
    return this.http.get<any>(host+'/queryConfiguration', {
      responseType: 'text'
    })
  }

  public doBalancedDataConformance() {
    return this.http.get<any>(host+'/balancedDataConformance', {
      responseType: 'text'
    }).pipe(timeout(600000))
  }

  public getAlignmentsGroups() {
    return this.http.get<any>(host+'/groups')
  }

  public getGraphInitial() {
    return this.http.get<any>(host+'/dotInitial', {
      responseType: 'text'
    })
  }

  public getGraphCustom() {
    return this.http.get<any>(host+'/dotCustom', {
      responseType: 'text'
    })
  }
  
  public getGraphFinal() {
    return this.http.get<any>(host+'/dotFinal', {
      responseType: 'text'
    })
  }
}