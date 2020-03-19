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
  private activities;
  private attributes;

  constructor(private configService: ConfigsService, private router:Router) {
    this.rowData = [];
    this.activities = [];
    this.attributes = [];
    this.columnDefs = [
      {
        headerName: 'Activity',
        field: 'activity',
        editable: true,
        cellEditor: 'agPopupSelectCellEditor',
        cellEditorParams: {
            values: this.activities             
        },
        rowDrag: true,
      },
      {
        headerName: 'Attribute',
        field: 'attribute',
        editable: true,
        cellEditor: 'agPopupSelectCellEditor',
        cellEditorParams: {
            values: this.attributes                
        }
      },
      {
        headerName: 'Non-writing Cost',
        field: 'nonWritingCost',
        editable: true,
        cellEditor: 'numericEditorComponent',
      },
      {
        headerName: 'Faulty-value Cost',
        field: 'faultyValueCost',
        editable: true,
        cellEditor: 'numericEditorComponent',
      },
      {
        headerName: 'Final Variable',
        field: 'finalVariable',
        cellRenderer: function(params) { 
          var input = document.createElement('input');
          input.type="checkbox";
          input.checked=params.value;
          input.addEventListener('click', function (event) {
              params.value=!params.value;
              params.node.data.finalVariable = params.value;
          });
          return input;
        }
      },
    ];

    this.frameworkComponents = {
      /* custom cell editor component*/
      numericEditorComponent: NumericEditorComponent,
    };
  }

  ngOnInit() {
    this.configService.getVariableMatchCost().subscribe((resp) => {
      console.log(resp)
      this.rowData = resp.entryList
      // this.activities = resp.activityMatchingList
      this.activities = ["*", "fuck"]
      this.attributes = resp.attributeMatchingList
      this.columnDefs[0].cellEditorParams = {
        values: resp.activityMatchingList
      }
      this.columnDefs[1].cellEditorParams = {
        values: resp.attributeMatchingList
      }
    })
    
  }

  public onFirstDataRendered(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();

    this.gridApi.setColumnDefs(this.columnDefs)
  }

  public insertRow() {
    let newItem = {
      activity: "*",
      attribute: "*",
      faultyValueCost: 1,
      finalVariable: false,
      nonWritingCost: 1
    }
    let res = this.gridApi.updateRowData({ add: [newItem] });
  }

  public deleteRow() {
    let selected = this.gridApi.getSelectedRows()
    if(this.getRowData().length > 1)
      this.gridApi.updateRowData({ remove: selected });
  }

  public getRowData() {
    let rowData = [];
    this.gridApi.forEachNode(function(node) {
      rowData.push(node.data);
    });
    return rowData;
  }

  public submit() {
    this.configService.postVariableMatchCost(this.getRowData()).subscribe(resp => {
        console.log(resp)
        this.router.navigateByUrl('variableBound')
    })
  }
}