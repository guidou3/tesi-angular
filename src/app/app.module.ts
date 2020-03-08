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

import { TableComponent } from './table/table.component';
import { Parameters1Component } from './parameters1/parameters1.component';

import {
  MatButtonModule,
  MatDialogModule,
  MatListModule,
  MatSelectModule,
  MatIconModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSliderModule,
  MatListModule
} from '@angular/material';
import { ConfigsService } from './configs.service';
import { MapTransitionsComponent } from './map-transitions/map-transitions.component'


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: MapTransitionsComponent },
      { path: 'params', component: Parameters1Component },
      { path: 'upload', component: UploadComponent },
    ]),
    AgGridModule.withComponents([]),
    FlexLayoutModule,
    UploadModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatListModule
  ],
  declarations: [ 
     AppComponent,
     InitialComponent,
     TableComponent,
     Parameters1Component,
     MapTransitionsComponent
  ],
  bootstrap:    [ 
    AppComponent
    ],
  providers: [ConfigsService]
})
export class AppModule { }
