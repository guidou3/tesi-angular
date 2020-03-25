import { Component, OnInit } from '@angular/core';
import { ConfigsService } from '../configs.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  private logMessage;
  private loading;

  private statics = [
    {
      name: "#Traces",
      value: 1
    },
    {
      name: "Min Fitness",
      value: 2
    },{
      name: "Average Fitness",
      value: 3
    },
    {
      name: "Median Fitness",
      value: 4
    },
    {
      name: "Max Fitness",
      value: 5
    }
  ]

  constructor(private configService: ConfigsService, private router:Router) { 
    this.logMessage = "Initializing"
    this.loading = true;
  }

  ngOnInit() {
    /*this.logMessage = "Initialized query configuration"
    this.configService.queryConfiguration().subscribe(response1 => {
      console.log(response1)
      this.logMessage = "Configuration obtained\nCalculating conformance"
      this.configService.doBalancedDataConformance().subscribe(response2 => {
        console.log(response2)
        this.logMessage = "Conformance checking succesfully obtained"
        this.loading = false;
      })
    })*/
    this.loading = false;
  }

}