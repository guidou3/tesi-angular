import { Component, OnInit } from '@angular/core';
import { NumericEditorComponent } from '../numeric-editor/numeric-editor.component'

@Component({
  selector: 'app-data-deviations',
  templateUrl: './data-deviations.component.html',
  styleUrls: ['./data-deviations.component.css']
})
export class DataDeviationsComponent implements OnInit {
  private frameworkComponents;

  private columnDefs;
  private rowData;
  private gridApi;
  private input;

  constructor() {
    this.columnDefs = [
      {
        headerName: 'Activity',
        field: 'activity'
      },
      {
        headerName: 'Attribute',
        field: 'attribute',
        editable: true,
        cellEditor: 'numericEditorComponent',
      },
      {
        headerName: 'Non-writing Cost',
        field: 'writingCost',
        editable: true,
        cellEditor: 'numericEditorComponent',
      },
      {
        headerName: 'Faulty-value Cost',
        field: 'faultyCost',
        editable: true,
        cellEditor: 'numericEditorComponent',
      },
      {
        headerName: 'Final Variable',
        field: 'variable',
        cellRenderer: function(params) { 
          var input = document.createElement('input');
          input.type="checkbox";
          input.checked=params.value;
          input.addEventListener('click', function (event) {
              params.value=!params.value;
              params.node.data.variabl = params.value;
          });
          return input;
        }
      },
    ];

    this.rowData = [
      { activity: 'Toyota', model: 'Celica', writingCost: 35000, variable: true },
      { activity: 'Ford', model: 'Mondeo', writingCost: 32000, variable: true },
      { activity: 'Porsche', model: 'Boxter', writingCost: 72000, variable: false }
    ];

    this.frameworkComponents = {
      /* custom cell editor component*/
      numericEditorComponent: NumericEditorComponent,
    };
  }

  ngOnInit() {
  }

  public onFirstDataRendered(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  public submit() {
    var rowData = [];
    this.gridApi.forEachNode(function(node) {
      rowData.push(node.data);
    });
    console.log(rowData)
  }
}