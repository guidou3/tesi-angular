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

  constructor(private configService: ConfigsService) { }

  ngOnInit() {
    this.configService.getGraph().subscribe(file => {
      graphviz('div')
      .addImage("images/plus.png", "20px", "20px")
      .addImage("https://cdn.onlinewebfonts.com/svg/img_463982.png", "25px", "25px")
      .renderDot(file)
      .fit(true);
    })
    
  }

}