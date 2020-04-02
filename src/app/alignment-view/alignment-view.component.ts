import { Component, OnInit, OnChanges, Input } from '@angular/core';

const LENGTH = 50;
const OFFSET = 27;
const MULTIPLIER = 2;

@Component({
  selector: 'app-alignment-view',
  templateUrl: './alignment-view.component.html',
  styleUrls: ['./alignment-view.component.css']
})

export class AlignmentViewComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() hideInvisible: boolean;
  @Input() highlight: boolean;
  @Input() colorActivities: boolean;

  private segments;
  private visible_segments;
  private last;
  private enlarged: boolean;

  constructor() { 
    this.visible_segments = [];
    this.enlarged = false;
    this.segments = []
  }

  ngOnInit() {
    let typeToColor = {
      'perfect': "rgb(0, 210, 0)",
      'model_only': "rgb(224, 176, 255)",
      'invisible': "gray",
      'log_only': "yellow",
      'wrong_data': "orange"
    }

    
    this.segments = this.data.list;
    this.segments = this.segments.map((obj) => {
      obj.label = obj.labelMin
      obj.alignmentcolor = typeToColor[obj.type]
      return obj
    })

    this.visible_segments = this.generatePaths()
  }

  ngOnChanges(changes) {
    if(changes.hideInvisible != null) 
      this.hideInvisible = changes.hideInvisible.currentValue
    if(changes.colorActivities != null)
      this.colorActivities = changes.colorActivities.currentValue
    if(changes.highlight != null)
      this.highlight = changes.highlight.currentValue
    this.visible_segments = this.generatePaths(true)
  }

  generatePaths(reset = false) {
    let start = OFFSET + 7
    return this.segments.reduce((res, obj) => {
      if(this.hideInvisible && obj.type === 'invisible')
        return res
      
      let length = this.getLength(obj)

      if(reset)
        this.enlarged = false
      else if(this.enlarged) {
        length *= MULTIPLIER
        obj.label = obj.labelMax
      }
      else if(!this.enlarged)
        obj.label = obj.labelMin
        

      obj.color = this.colorActivities && obj.transitionColor || obj.alignmentcolor
    
      obj.start = start + 1
      obj.d = this.getPath(start-OFFSET, length)
      start += length + 5

      res.push(obj)
      return res
    }, [])
  }

  public enlarge() {
    this.enlarged = !this.enlarged
    this.visible_segments = this.generatePaths()
  }

  getPath(start, length) {
    return "M " + start + " 0 l " + length + " 0 l 25 25 l -25 25 l -" + length + " 0 l 25 -25z"
  }

  getLength(obj) {
    if(this.highlight && obj.type === 'perfect') {
      return LENGTH/2
    }
    else 
      return LENGTH
  }
}