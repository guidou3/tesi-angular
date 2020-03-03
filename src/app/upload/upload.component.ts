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
  modelLabel:String = ""
  ceLabel:String = ""
  logLabel:String = ""

  files:Set<File> = new Set()

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

  public openUploadDialog() {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '50%',
      height: '50%',
    })
  }
}