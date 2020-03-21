import { Component, OnInit } from '@angular/core';
import { graphviz }  from 'd3-graphviz';
import { ConfigsService } from '../configs.service'

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  title = 'd3-graphviz in Angular';
  list = [
    {
      initial: 'x.svg',
      final: 'https://svgshare.com/i/JMX.svg'
    },
    {
      initial: 'plus.svg',
      final: 'https://svgshare.com/i/JKS.svg'
    }
  ]

  constructor(private configService: ConfigsService) { }

  ngOnInit() {
    this.configService.getGraph().subscribe(file => {
      let graph = graphviz('div')

      this.list.forEach(obj => {
        file = file.replace(new RegExp(obj.initial, 'g'), obj.final)
        graph.addImage(obj.final, "25px", "25px")
      })


      graph
      .renderDot(file)
      .fit(true);

    })
    
  }

}