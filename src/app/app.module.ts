import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { InitialComponent } from './initial/initial.component';
import { AgGridModule } from 'ag-grid-angular';
import { FlexLayoutModule } from '@angular/flex-layout';

import { UploadModule } from './upload/upload.module'
import { UploadComponent } from './upload/upload.component'

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
  MatInputModule,
  MatProgressSpinnerModule,
  MatToolbarModule
} from '@angular/material';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ConfigsService } from './configs.service';
import { MapTransitionsComponent } from './map-transitions/map-transitions.component';
import { MapVariablesComponent } from './map-variables/map-variables.component';
import { ControlFlowCostComponent } from './control-flow-cost/control-flow-cost.component';
import { NumericEditorComponent } from './numeric-editor/numeric-editor.component';
import { DataDeviationsComponent } from './data-deviations/data-deviations.component';
import { VariablesBoundsComponent } from './variables-bounds/variables-bounds.component';
import { ResultsComponent } from './results/results.component';
import { GraphComponent } from './graph/graph.component';
import { GroupedAlignmentsComponent } from './grouped-alignments/grouped-alignments.component'


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: GroupedAlignmentsComponent },
      { path: 'graph', component: GraphComponent },
      { path: 'result', component: ResultsComponent },
      { path: 'variableBound', component: VariablesBoundsComponent },
      { path: 'dataCost', component: DataDeviationsComponent },
      { path: 'flowCost', component: ControlFlowCostComponent },
      { path: 'mapping', component: MapTransitionsComponent },
      { path: 'variablesMapping', component: MapVariablesComponent },
      { path: 'params', component: Parameters1Component },
      { path: 'upload', component: UploadComponent },
    ]),
    AgGridModule.withComponents([
      NumericEditorComponent
    ]),
    FlexLayoutModule,
    UploadModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    Ng2SearchPipeModule
  ],
  declarations: [ 
     AppComponent,
     InitialComponent,
     Parameters1Component,
     MapTransitionsComponent,
     MapVariablesComponent,
     ControlFlowCostComponent,
     NumericEditorComponent,
     DataDeviationsComponent,
     VariablesBoundsComponent,
     ResultsComponent,
     GraphComponent,
     GroupedAlignmentsComponent
  ],
  bootstrap:    [ 
    AppComponent
    ],
  providers: [ConfigsService]
})
export class AppModule { }
