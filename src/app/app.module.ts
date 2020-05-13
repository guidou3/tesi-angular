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



import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSliderModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ConfigsService } from './configs.service';

import { ConfigurationComponent } from './configuration/configuration.component';
import { MapTransitionsComponent } from './map-transitions/map-transitions.component';
import { MapVariablesComponent } from './map-variables/map-variables.component';
import { ControlFlowCostComponent } from './control-flow-cost/control-flow-cost.component';
import { NumericEditorComponent } from './numeric-editor/numeric-editor.component';
import { DataDeviationsComponent } from './data-deviations/data-deviations.component';
import { VariablesBoundsComponent } from './variables-bounds/variables-bounds.component';
import { ResultsComponent } from './results/results.component';
import { GraphComponent } from './graph/graph.component';
import { GroupedAlignmentsComponent } from './grouped-alignments/grouped-alignments.component';
import { DialogView } from './grouped-alignments/dialog-view';
import { AlignmentLegendComponent } from './alignment-legend/alignment-legend.component';
import { AlignmentStatisticsComponent } from './alignment-statistics/alignment-statistics.component';
import { SelectedAlignmentsDetailsComponent } from './selected-alignments-details/selected-alignments-details.component';
import { AlignmentViewComponent } from './alignment-view/alignment-view.component'


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: ConfigurationComponent },
      { path: 'grouped', component: GroupedAlignmentsComponent },
      { path: 'graph', component: GraphComponent },
      { path: 'result', component: ResultsComponent },
      { path: 'variableBound', component: VariablesBoundsComponent },
      { path: 'dataCost', component: DataDeviationsComponent },
      { path: 'flowCost', component: ControlFlowCostComponent },
      { path: 'mapping', component: MapTransitionsComponent },
      { path: 'variablesMapping', component: MapVariablesComponent },
      { path: 'configuration', component: ConfigurationComponent },
      { path: 'upload', component: UploadComponent },
    ]),
    AgGridModule.withComponents([
      NumericEditorComponent
    ]),
    BrowserAnimationsModule,
    FlexLayoutModule,
    UploadModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSliderModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  declarations: [ 
     AppComponent,
     InitialComponent,
     ConfigurationComponent,
     MapTransitionsComponent,
     MapVariablesComponent,
     ControlFlowCostComponent,
     NumericEditorComponent,
     DataDeviationsComponent,
     VariablesBoundsComponent,
     ResultsComponent,
     GraphComponent,
     GroupedAlignmentsComponent,
     DialogView,
     AlignmentLegendComponent,
     AlignmentStatisticsComponent,
     SelectedAlignmentsDetailsComponent,
     AlignmentViewComponent
  ],
  bootstrap:    [ 
    AppComponent
    ],
  providers: [ConfigsService],
  entryComponents: [
    DialogView
  ]
})
export class AppModule { }
