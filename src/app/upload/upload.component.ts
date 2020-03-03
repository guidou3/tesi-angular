import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material'
import { DialogComponent } from './dialogue/dialogue.component'
import { UploadService } from './upload.service'

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
  modelLabel:String = "Upload model"
  ceLabel:String = "Upload custom elements"
  logLabel:String = "Upload log"

  model:File
  customElements:File
  log:File

  public getModel() {
    this.modelInput.nativeElement.click();
  }

  public subModel(string:String) {
    this.customElements = this.modelInput.nativeElement.files[0]
    this.modelLabel = this.model.name
  }

  public getCustomElements() {
    this.modelInput.nativeElement.click();
  }

  public subCustomElements(string:String) {
    this.customElements = this.ceInput.nativeElement.files[0]
    this.ceLabel = this.customElements.name
  }

  public getLog() {
    this.logInput.nativeElement.click();
  }

  public subLog(string:String) {
    this.log = this.logInput.nativeElement.files[0]
    this.logLabel = this.log.name
  }

  public openUploadDialog() {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '50%',
      height: '50%',
    })
  }
}