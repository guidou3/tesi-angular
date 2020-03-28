import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-alignment-view',
  templateUrl: './alignment-view.component.html',
  styleUrls: ['./alignment-view.component.css']
})
export class AlignmentViewComponent implements OnInit, OnChanges {
  @Input() segments;
  @Input() length: number;
  @Input() hideInvisible: boolean;
  @Input() highlight: boolean;

  private visible_segments;
  private last;
  private enlarged: boolean;
  private multiplier: number;

  constructor() { 
    this.visible_segments = [];
    this.enlarged = false;
    this.multiplier = 2
  }

  ngOnInit() {
    let typeToColor = {
      'perfect': "rgb(0, 210, 0)",
      'model_only': "rgb(224, 176, 255)",
      'invisible': "gray",
      'log_only': "yellow",
      'data': "orange"

    }
    
    this.segments = this.segments.map((obj) => {
      obj.color = obj.color || typeToColor[obj.type]
      return obj
    })

    this.visible_segments = this.generatePaths()
  }

  ngOnChanges(changes) {
    if(changes.hideInvisible != null) {
      this.hideInvisible = changes.hideInvisible.currentValue
      this.visible_segments = this.generatePaths()
    }

  }

  generatePaths() {
    let start = 5;
    let length = this.length
    let i = 0;

    return this.segments.reduce((res, obj) => {
      if(this.hideInvisible && obj.type === 'invisible')
        return res
      
      obj.start = start
      if(i === 0) {
        start += length + 32
        obj.d = "M 0 0 l " + length + " 0 l 30 25 l -30 25 l -" + length + " 0 z"
      }
      else {
        start += length + 5
         let initial = i * (length + 5)
          obj.d = "M " + initial + " 0 l " + length + " 0 l 30 25 l -30 25 l -" + length + " 0 l 30 -25z"
      }
      i++

      res.push(obj)
      return res
    }, [])
  }

  public enlarge() {
    let shift = this.length
    if(!this.enlarged) {
      let old_length = this.length
      let new_length = this.length * this.multiplier
      this.visible_segments = this.visible_segments.map((obj, i) => {
        if(i === 0)
          obj.d = "M 0 0 l " + new_length + " 0 l 30 25 l -30 25 l -" + new_length + " 0 z"
        else {
          obj.start += old_length * i
          let start = i * (new_length + 5)
          obj.d = "M " + start + " 0 l " + new_length + " 0 l 30 25 l -30 25 l -" + new_length + " 0 l 30 -25z"
        }
        return obj
      })
      this.enlarged = true
    }
    else {
      let length = this.length
      this.visible_segments = this.visible_segments.map((obj, i) => {
        if(i === 0)
          obj.d = "M 0 0 l " + length + " 0 l 30 25 l -30 25 l -" + length + " 0 z"
        else {
          obj.start -= length * i
          let start = i * (length + 5)
          obj.d = "M " + start + " 0 l " + length + " 0 l 30 25 l -30 25 l -" + length + " 0 l 30 -25z"
        }
        return obj
      })
      this.enlarged = false
    }
  }
}