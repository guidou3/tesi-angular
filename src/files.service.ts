import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    // this.http.post('http://localhost:9000/', model)
    this.http.get('http://192.168.1.133:9000/', { observe: 'response' })
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