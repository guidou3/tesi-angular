import { Component, OnInit } from '@angular/core';
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { NumericEditorComponent } from '../numeric-editor/numeric-editor.component'
import { FormControl } from '@angular/forms';
import { ConfigsService } from '../configs.service'
import { Router } from '@angular/router';


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
  

  constructor(private configService: ConfigsService, private router:Router) { 
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

  public onFirstDataRendered1(params) {
    this.gridApi1 = params.api;
    params.api.sizeColumnsToFit();
  }

  public updateValue1() {
    let api = this.gridApi1
    let value = this.input1.value
    console.log(this.rowData1)
    this.rowData1.forEach(function (obj) {
      if(obj.cost != 0)
        obj.cost = value
      api.updateRowData({ update: [obj] });
      // TODO don't change invisible transitions
    })
  }

  public onFirstDataRendered2(params) {
    this.gridApi2 = params.api;
    params.api.sizeColumnsToFit();
  }

  public updateValue2() {
    let api = this.gridApi2
    let value = this.input2.value
    this.rowData2.forEach(function (obj) {
      obj.cost = value
      api.updateRowData({ update: [obj] });
    })
  }

  public submit() {
    /*var rowData = [];
    this.gridApi.forEachNode(function(node) {
      rowData.push(node.data);
    });*/
    let result = {
      modelTable: this.rowData1.concat(this.invisible),
      logTable: this.rowData2
    }
    console.log(result)
    this.configService.postControlFlowCost(result).subscribe(resp => {
        console.log(resp)
        this.router.navigateByUrl('variablesMapping')
      })
  }
}