import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material'
import { DialogComponent } from './dialogue/dialogue.component'
import { UploadService } from './upload.service'
import { forkJoin } from 'rxjs/observable/forkJoin'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  constructor(public dialog: MatDialog, public uploadService: UploadService) {}

  @ViewChild('modelInput', {static: false}) modelInput
  @ViewChild('ceInput', {static: false}) ceInput
  @ViewChild('logInput', {static: false}) logInput
  modelLabel:String = ""
  ceLabel:String = ""
  logLabel:String = ""

  files:Array<File> = new Array()

  progress
  uploading = false
  uploadSuccessful = false
  disableUpload = false

  public getModel() {
    this.modelInput.nativeElement.click();
  }

  public subModel() {
    this.files[0] = this.modelInput.nativeElement.files[0]
    this.modelLabel = this.files[0].name
  }

  public getCustomElements() {
    this.ceInput.nativeElement.click();
  }

  public subCustomElements() {
    this.files[1] = this.ceInput.nativeElement.files[0]
    this.ceLabel = this.files[1].name
  }

  public getLog() {
    this.logInput.nativeElement.click();
  }

  public subLog() {
    this.files[2] = this.logInput.nativeElement.files[0]
    this.logLabel = this.files[2].name
  }

  public upload() {
    // set the component state to "uploading"
    this.uploading = true;
    // start the upload and save the progress map
    this.progress = this.uploadService.upload(new Set(this.files));
    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // Disable the upload button after the process starts
    this.disableUpload = true;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.disableUpload = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
      console.log("here")e
    });
  }

  public openUploadDialog() {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '50%',
      height: '50%',
    })
  }
}