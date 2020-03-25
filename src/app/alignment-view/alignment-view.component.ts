import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alignment-view',
  templateUrl: './alignment-view.component.html',
  styleUrls: ['./alignment-view.component.css']
})
export class AlignmentViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public number2() {e
    console.log("clicked")
  }

}