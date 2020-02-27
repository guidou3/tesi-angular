import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { host } from './net.json';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  files = {
    model: null,
    log: null,
    customElements: null
  };
  constructor(private http: HttpClient) { }

  addModel(model : File) {
    this.files.model = model;
    // this.http.post('http://localhost:9000/api/prova', model)
    this.http.get<String>(host + 'api/prova')
    .subscribe(resp => console.log(resp))
    
  }

  addCustomElements(ce) {
    this.files.customElements = ce;
  }

  addLog(log) {
    this.files.log = log;
  }

  clear() {
    this.files = {
      model: null,
      log: null,
      customElements: null
    };
  }

}