import { Component, OnInit, OnChanges, Input } from '@angular/core';

const LENGTH = 65;
const OFFSET = 27;
const MULTIPLIER = 1.5;

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
  @Input() focus: boolean;

  private segments;
  private visible_segments;
  private constraints;
  private start;

  private columnDefs;
  private tableItems;

  private missingVariables: Set<String>;
  private incorrectVariables: Set<String>;

  constructor() { 
    this.visible_segments = [];
    this.segments = [];

    this.columnDefs = [
      {
        headerName: 'Transition',
        field: 'label'
      },
      {
        headerName: 'Type',
        field: 'type',
      }
    ];
    this.missingVariables = new Set();
    this.incorrectVariables = new Set();
    this.tableItems = [];
    
  }

  ngOnInit() {
    let typeToColor = {
      'perfect': "rgb(0, 210, 0)",
      'model_only': "rgb(224, 176, 255)",
      'invisible': "gray",
      'log_only': "yellow",
      'wrong_data': "orange",
      'customCorrect': 'lightblue',
      'customWrong': 'rgb(240,50,10)'
    }

    let typeToLabel = {
      'perfect': "Perfect match",
      'model_only': "Move only in model",
      'log_only': "Move only in log",
      'wrong_data': "Wrong data",
      'customCorrect': 'Custom constraint correct',
      'customWrong': 'Custom constraint wrong'
    }

    this.focus = this.focus || false;

    this.segments = this.data.list;
    let up = true;
    let start = 0
    
    if(this.data.constraints != null) {
      this.constraints = this.data.constraints.map((obj) => {
        obj.color = obj.result ? "rgb(0, 210, 0)" : "rgb(240,50,10)"
        if(up) {
          obj.y = 0
          obj.x = start
        }
        else {
          obj.y = 27
          obj.x = start
          start += LENGTH + 5
        }
        up = !up
        return obj
      })
    }

    let tableItems = this.tableItems;
    let missingVariables = this.missingVariables;
    let incorrectVariables = this.incorrectVariables;
    this.segments = this.segments.map((obj) => {
      let label = obj.labelMin.join(' ')
      if(label.includes("Time Distance")) {
        if(label.includes("Correct"))
          obj.type = 'customCorrect'
        else
          obj.type = 'customWrong'
      }
        
      if(obj.type !== "invisible")
        tableItems.push({
          "label" : label,
          "type": typeToLabel[obj.type]
        })
      if(obj.missingVariables) {
        obj.missingVariables.forEach((item) => {
          missingVariables.add(item._1)
        })
      }
      if(obj.incorrectVariables) {
        obj.incorrectVariables.forEach((item) => {
          incorrectVariables.add(item.variable)
        })
      }
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
    let segments = this.segments.reduce((res, obj) => {
      if(this.hideInvisible && obj.type === 'invisible')
        return res
      
      let length = this.getLength(obj)

      if(reset)
        this.focus = false
      else if(this.focus) {
        length *= MULTIPLIER
        obj.label = obj.labelMax
      }
      else if(!this.focus)
        obj.label = obj.labelMin
        

      obj.color = this.colorActivities && obj.transitionColor || obj.alignmentcolor
    
      obj.start = start + 1
      obj.d = this.getPath(start-OFFSET, length)
      start += length + 5

      res.push(obj)
      return res
    }, [])
    this.start = start
    return segments
  }

  public enlarge() {
    this.focus = !this.focus
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

  public onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }
}