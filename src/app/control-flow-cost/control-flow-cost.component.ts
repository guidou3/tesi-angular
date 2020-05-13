import { Component, OnInit } from '@angular/core';
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { NumericEditorComponent } from '../numeric-editor/numeric-editor.component'
import { FormControl } from '@angular/forms';
import { ConfigsService } from '../configs.service'
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-control-flow-cost',
  templateUrl: './control-flow-cost.component.html',
  styleUrls: ['./control-flow-cost.component.css']
})
export class ControlFlowCostComponent implements OnInit {
  private frameworkComponents;

  private columnDefs1;
  private rowData1;
  private gridApi1;
  private input1;

  private invisible;

  private columnDefs2;
  private rowData2;
  private gridApi2;
  private input2;
  

  constructor(private configService: ConfigsService, private router:Router, private location: Location) { 
    this.input1 = new FormControl(1);
    this.input2 = new FormControl(1);
    this.invisible = [];
    this.columnDefs1 = [
      {
        headerName: 'Transition',
        field: 'transition'
      },
      {
        headerName: 'Move on model cost',
        field: 'cost',
        editable: true,
        cellEditor: 'numericEditorComponent',
      }
    ];

    this.rowData1 = [];

    this.columnDefs2 = [
      {
        headerName: 'Transition',
        field: 'transition'
      },
      {
        headerName: 'Move on log cost',
        field: 'cost',
        editable: true,
        cellEditor: 'numericEditorComponent',
      }
    ];

    this.rowData2 = [];

    this.frameworkComponents = {
      /* custom cell editor component*/
      numericEditorComponent: NumericEditorComponent,
    };

  }

  ngOnInit() {
    this.configService.getControlFlowCost().subscribe((result) => {
      var invisible = this.invisible;
      this.rowData1 = result.modelTable.reduce((res, obj) => {
        if(obj.cost === 0)
          invisible.push(obj)
        else
          res.push(obj)
        return res
      }, [])
      this.rowData2 = result.logTable
    })
  }

  /**
   * Resize the table to fit the page's width.
   *
   * @param params - Parameters of the table
   * @param i - Index of the table
   */

  public onFirstDataRendered(params, i) {
    if(i === 1)
      this.gridApi1 = params.api;
    else
      this.gridApi2 = params.api;

    params.api.sizeColumnsToFit();
  }

  /**
   * Updates the cost of all the elements of the table
   *
   * @param i - Index of the table
   */

  public updateValue(i) {
    let api = i === 1 ? this.gridApi1 : this.gridApi2;
    let value = i === 1 ? this.input1.value : this.input2.value;
    let rowData = i === 1 ? this.rowData1 : this.rowData2;

    rowData.forEach(function (obj) {
      if(obj.cost != 0)
        obj.cost = value
      api.updateRowData({ update: [obj] });
    })
  }

  /**
   * Posts the costs of control flow deviations
   */

  public submit() {
    let modelTable = []
    this.gridApi1.forEachNode(function(node) {
      modelTable.push(node.data);
    });

    let logTable = []
    this.gridApi2.forEachNode(function(node) {
      logTable.push(node.data);
    });

    this.configService.postControlFlowCost({
      modelTable: modelTable.concat(this.invisible),
      logTable: logTable
    }).subscribe(resp => {
      this.router.navigateByUrl('variablesMapping')
    })
  }
}