import { Component, OnInit } from '@angular/core';
import { NumericEditorComponent } from '../numeric-editor/numeric-editor.component'
import { ConfigsService } from '../configs.service'
import { Router } from '@angular/router';


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

  constructor(private configService: ConfigsService, private router:Router) {
    this.columnDefs = [
      {
        headerName: 'Activity',
        field: 'activity',
        editable: true,
        cellEditor: 'agPopupSelectCellEditor',
        cellEditorParams: {
            values: ['*', 'Spanish', 'French', 'Portuguese', '(other)']             
        }
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

    this.rowData = [];

    this.frameworkComponents = {
      /* custom cell editor component*/
      numericEditorComponent: NumericEditorComponent,
    };
  }

  ngOnInit() {
    this.columnDefs[0].cellEditorParams = {
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