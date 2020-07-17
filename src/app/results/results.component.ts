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

  private percentages;
  private mean;
  private lastTime;

  

  constructor(private configService: ConfigsService, private router:Router) { 
    this.logMessage = "Initializing"
    this.loading = true;
    this.percentages = [];
    this.mean = 0;
  }

  ngOnInit() {
    this.logMessage = ["Initialized query configuration"]
    this.configService.queryConfiguration().subscribe(response1 => {
      this.logMessage = ["Configuration obtained", "Calculating conformance"]
      this.configService.doBalancedDataConformance().subscribe(response2 => {
        this.logMessage = ["Conformance checking succesfully obtained"]
        this.loading = false;
        this.router.navigateByUrl('grouped')
      })
      this.logMessage[2] = "0% - Estimated time: ..."
      this.lastTime = new Date().getTime()
      setInterval(() => {
        this.configService.getProgress().subscribe(data => {
          console.log(data)
          let progress = parseFloat(data[0])
          if(progress >= 97 && data[1]) {
            this.loading = false;
            this.router.navigateByUrl('grouped')
          }
          else {
            this.percentages.push(progress)
            
            if(this.percentages.length > 1) {
              let timeDiff = new Date().getTime() - this.lastTime;
              if(timeDiff > 1000) {
                timeDiff = timeDiff / 1000
                let last = (progress - this.percentages[this.percentages.length-2]) / timeDiff
                this.mean = (this.mean * (this.percentages.length -1 ) +  last) / this.percentages.length
                this.lastTime = new Date().getTime();
              }
            }
            else {
              let timeDiff = (new Date().getTime() - this.lastTime)/1000;
              this.mean = progress / timeDiff
              this.lastTime = new Date().getTime();
            }
              
            // mean = % ogni 3 secondi
            let tot = Math.floor((100 - progress) / this.mean);

            this.logMessage[2] = progress.toFixed(2) + "% - Estimated time: "

            if(tot < 60) 
              this.logMessage[2] +=  tot + " seconds";
            else if(tot < 3600)
              this.logMessage[2] += Math.floor(tot/60) + " minutes";
            else
              this.logMessage[2] += Math.floor(tot/3600) + " hours and " + Math.floor(Math.floor(tot%3600)/60) + " minutes";
          }
        })
      }, 3000)
      
    })
  }
}