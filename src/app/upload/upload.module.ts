import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatButtonModule,
  MatDialogModule,
  MatListModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatIconModule
} from '@angular/material'
import { DialogComponent } from './dialogue/dialogue.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlexLayoutModule } from '@angular/flex-layout'
import { UploadService } from './upload.service'
import { HttpClientModule } from '@angular/common/http';
import { UploadComponent } from './upload.component'

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatListModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatIconModule
  ],
  declarations: [UploadComponent, DialogComponent],
  exports: [UploadComponent],
  entryComponents: [DialogComponent], // Add the DialogComponent as entry component
  providers: [UploadService],
})
export class UploadModule {}