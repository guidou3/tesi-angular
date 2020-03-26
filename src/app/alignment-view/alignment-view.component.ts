import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alignment-view',
  templateUrl: './alignment-view.component.html',
  styleUrls: ['./alignment-view.component.css']
})
export class AlignmentViewComponent implements OnInit {
  @Input() segments;
  private paths
  private last;

  constructor() { 
    this.paths = []
  }

  ngOnInit() {
    console.log(this.segments)
    this.paths = this.segments
  }

  public enlarge(index) {
    if(this.last != null) {
      if(this.last < index)
        this.diminish(this.last, index-1)
      else if(this.last === index)
        return;
    }
      
    if(index === 0)
      this.printFirst(this.paths[index].length*2)
    else
      this.printOthers(this.paths[index].length*2, index, 0)
  }

  printFirst(length) {
    this.paths[0].d = "M 0 0 l " + length + " 0 l 30 25 l -30 25 l -" + length + " 0 z"
    this.last = 0
    if(this.paths.length !== 1)
      this.printOthers(this.paths[1].length, 1, length/2)
  }

  printOthers(length, index, shift) {
    let start = index *55 + shift;
    console.log(index + " " +start + " " +start)
    this.paths[index].d = "M " + start + " 0 l " + length + " 0 l 30 25 l -30 25 l -" + length + " 0 l 30 -25z"

    if(shift === 0) {
      shift = length/2
      this.last = index
    }

    if(index < this.paths.length -1)
      this.printOthers(this.paths[index+1].length, index+1, shift)
  }

  diminish(index, final) {
    if(index <= final) {
      let length = this.paths[index].length
      if(index === 0)
        this.paths[0].d = "M 0 0 l " + length + " 0 l 30 25 l -30 25 l -" + length + " 0 z"
      else {
        this.paths[index].d = "M " + index * 55 + " 0 l " + length + " 0 l 30 25 l -30 25 l -" + length + " 0 l 30 -25z"
      }
      this.diminish(index+1, final)
    }
  }
}