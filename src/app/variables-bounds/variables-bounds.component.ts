import { Component, OnInit } from '@angular/core';
import { NumericEditorComponent } from '../numeric-editor/numeric-editor.component'
import { ConfigsService } from '../configs.service'
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-variables-bounds',
  templateUrl: './variables-bounds.component.html',
  styleUrls: ['./variables-bounds.component.css']
})
export class VariablesBoundsComponent implements OnInit {
  private frameworkComponents;

  private columnDefs;
  private rowData;
  private customData;
  private gridApi;
  private input;

  constructor(private configService: ConfigsService, private router:Router, private location: Location) {
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
            values: ["String", "Integer", "Float", "Date", "Boolean"]             
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

    this.rowData = [];
    this.customData = [];

    this.frameworkComponents = {
      /* custom cell editor component*/
      numericEditorComponent: NumericEditorComponent,
    };
  }

  ngOnInit() {
    this.configService.getVariableBounds().subscribe(resp => {
      let newRowdata = []
      for(let obj of resp.list) {
        if(obj.variable.indexOf("custom") !== 0)
          newRowdata.push(obj)
        else
          this.customData.push(obj)
      }
      this.rowData = newRowdata
    })
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
    rowData = rowData.concat(this.customData)

    this.configService.postVariableBounds(rowData).subscribe(resp => {
        console.log(resp)
        this.router.navigateByUrl('result')
    })
  }
}