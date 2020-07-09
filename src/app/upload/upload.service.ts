import { Injectable } from '@angular/core'
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import {host} from '../../net.json'



@Injectable()
export class UploadService {
  constructor(private http: HttpClient) {}

  public upload(files: Set<File>, fileToIndex):
    { [key: string]: { progress: Observable<number> } } {

    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    let index=0;
    let url = new Map()
      .set(fileToIndex.model, host + '/uploadModel')
      .set(fileToIndex.ce, host + '/uploadCustomElements')
      .set(fileToIndex.log, host + '/uploadLog')

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', url.get(index), formData, {
        reportProgress: true,
        responseType: 'text'
      });

      index +=1

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);

        } else if (event instanceof HttpResponse) {

          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });
    // return the map of progress.observables
    return status;
  }
}