import { Component, OnInit } from '@angular/core';
import { NumericEditorComponent } from '../numeric-editor/numeric-editor.component'

@Component({
  selector: 'app-variables-bounds',
  templateUrl: './variables-bounds.component.html',
  styleUrls: ['./variables-bounds.component.css']
})
export class VariablesBoundsComponent implements OnInit {
  private frameworkComponents;

  private columnDefs;
  private rowData;
  private gridApi;
  private input;

  constructor() {
    this.columnDefs = [
      {
        headerName: 'Variable name',
        field: 'variable',
        editable: true
      },
      {
        headerName: 'Type',
        field: 'type',
        editable: true,
        cellEditor: 'agPopupSelectCellEditor',
        cellEditorParams: {
            values: []             
        }
      },
      {
        headerName: 'Minimum Value',
        field: 'minimum',
        editable: true,
        cellEditor: 'numericEditorComponent',
      },
      {
        headerName: 'Maximum Value',
        field: 'maximum',
        editable: true,
        cellEditor: 'numericEditorComponent',
      }
    ];

    this.rowData = [
      { variable: 'Toyota', model: 'Celica', minimum: 35000 },
      { variable: 'Ford', model: 'Mondeo', minimum: 32000 },
      { variable: 'Porsche', model: 'Boxter', minimum: 72000 }
    ];

    this.frameworkComponents = {
      /* custom cell editor component*/
      numericEditorComponent: NumericEditorComponent,
    };
  }

  ngOnInit() {
    this.columnDefs[1].cellEditorParams = {
      values: ['*', 'fuck you']
    }
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