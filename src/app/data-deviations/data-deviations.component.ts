import { Component, OnInit, ViewChild } from '@angular/core';
import { NumericEditorComponent } from '../numeric-editor/numeric-editor.component'
import { ConfigsService } from '../configs.service'
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-data-deviations',
  templateUrl: './data-deviations.component.html',
  styleUrls: ['./data-deviations.component.css']
})
export class DataDeviationsComponent implements OnInit {
  @ViewChild('tableInput', {static: false}) tableInput
  private frameworkComponents;

  private columnDefs;
  private rowData;
  private gridApi;

  constructor(private configService: ConfigsService, private router:Router, private location: Location) {
    this.rowData = [];
    this.columnDefs = [
      {
        headerName: 'Activity',
        field: 'activity',
        editable: true,
        cellEditor: 'agPopupSelectCellEditor',
        cellEditorParams: {
            values: []             
        },
        rowDrag: true,
      },
      {
        headerName: 'Attribute',
        field: 'attribute',
        editable: true,
        cellEditor: 'agPopupSelectCellEditor',
        cellEditorParams: {
            values: []                
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
      this.columnDefs[0].cellEditorParams = {
        values: resp.activityMatchingList
      }
      this.columnDefs[1].cellEditorParams = {
        values: resp.attributeMatchingList
      }
    })
    
  }

  /**
   * Resize the table to fit the page's width and adds the columns
   *
   * @param params - Parameters of the table
   */

  public onFirstDataRendered(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();

    this.gridApi.setColumnDefs(this.columnDefs)
  }

  /**
   * Inserts a new row in the table with default values
   */

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

  /**
   * Deletes a row from the table
   */

  public deleteRow() {
    let selected = this.gridApi.getSelectedRows()
    if(this.getRowData().length > 1)
      this.gridApi.updateRowData({ remove: selected });
  }

  /**
   * Returns the list of the elements in the table
   * 
   * @returns The list of the elements inside the table
   */

  public getRowData() {
    let rowData = [];
    this.gridApi.forEachNode(function(node) {
      rowData.push(node.data);
    });
    return rowData;
  }

  /**
   * Opens the dialog to upload a file
   */

  public getTable() {
    this.tableInput.nativeElement.click();
  }

  /**
   * Uploads a json, parse it and add the data to the table
   */

  public uploadTable() {
    let fileReader = new FileReader();
    let file = this.tableInput.nativeElement.files[0]

    fileReader.onload = (e) => {
      let data = JSON.parse(fileReader.result.toString())
      this.gridApi.setRowData(data)

    }
    fileReader.readAsText(file);
  }

  /**
   * Creates a json containing the data inside the table
   */

  public saveTable() {
    var encodedData = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.getRowData()));
    var downloader = document.createElement('a');

    downloader.setAttribute('href', encodedData);
    downloader.setAttribute('download', 'deviationsCosts.json');
    downloader.click();
  }

  /**
   * Posts the costs of data deviations
   */

  public submit() {
    this.configService.postVariableMatchCost(this.getRowData()).subscribe(resp => {
        this.router.navigateByUrl('variableBound')
    })
  }
}