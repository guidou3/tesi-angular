import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alignment-view',
  templateUrl: './alignment-view.component.html',
  styleUrls: ['./alignment-view.component.css']
})
export class AlignmentViewComponent implements OnInit {
  private paths;
  constructor() { 
    let index = 1;
    this.paths = [ 
      {
        length: 50,
        color: "white",
        path: 'M 0 0 l 50 0 l 30 25 l -30 25 l -50 0 z'
      },
      {
        length: 50,
        color: "white",
        path: 'M 55 0 l 50 0 l 30 25 l -30 25 l -50 0 l 30 -25 z'
      },
      {
        length: 50,
        color: "white",
        path: 'M 1 0 l 50 0 l 30 25 l -30 25 l -50 0 l 30 -25 z'
      },

      
    ]
  }

  ngOnInit() {
  }

  public number2(params) {
    console.log("clicked")
    console.log(params)
  }

  printFirst(length) {
    return "M 0 0 l " + length + " 0 l 30 25 l -30 25 l -" + length + " 0 z"
  }

  printOthers(length, index) {
    return "M " + index + " 0 l " + length + " 0 l 30 25 l -30 25 l -" + length + " 0 l 30 -25z"
  }

}