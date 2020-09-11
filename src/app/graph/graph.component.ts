import { Component, OnInit } from '@angular/core';
import { graphviz }  from 'd3-graphviz';
import { ConfigsService } from '../configs.service'

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  private columnDefs;
  private rowData;
  private txt;

  constructor(private configService: ConfigsService) { 
    this.columnDefs = [
      {
        headerName: 'Transition',
        field: 'transition'
      },
      {
        headerName: 'Guards',
        field: 'guard'
      }
    ];

    this.rowData = [];
  }

  ngOnInit() {
    this.configService.getGraphCust().subscribe(graphData => {
      let graph = graphviz('div')
      graphData = JSON.parse(graphData)
      console.log(graphData)

      /*this.list.forEach(obj => {
        file = file.replace(new RegExp(obj.initial, 'g'), obj.final)
        graph.addImage(obj.final, "25px", "25px")
      })*/
      window.innerWidth
      graph
      .renderDot(graphData.dot)
      .width(window.innerWidth*9/10)
      .height(window.innerWidth*7/10)
      .fit(true);

      this.txt = graphData.dot
      let texTable = ""
      this.rowData = graphData.guards.map(obj => {
        texTable += "\\hline\n"+ obj._1 + " & \\texttt{\\detokenize{" + obj._2 + "}}\\\\ \n"
        return {
          transition: obj._1,
          guard: obj._2
        }
      })
      console.log(texTable)

    })
  }

  public onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

}