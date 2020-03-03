import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { InitialComponent } from './initial/initial.component';
import { AgGridModule } from 'ag-grid-angular';
import { FlexLayoutModule } from '@angular/flex-layout';

import { UploadModule } from './upload/upload.module'
import { UploadComponent } from './upload/upload.component'

import { InputsModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md'

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: UploadComponent },
    ]),
    AgGridModule.withComponents([]),
    FlexLayoutModule,
    UploadModule
  ],
  declarations: [ 
     AppComponent,
     InitialComponent
  ],
  bootstrap:    [ 
    AppComponent
    ]
})
export class AppModule { }
