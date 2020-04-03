import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfigsService } from '../configs.service'
import { Router } from '@angular/router';

import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 10000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-grouped-alignments',
  templateUrl: './grouped-alignments.component.html',
  styleUrls: ['./grouped-alignments.component.css'],
  providers: [
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS, 
      useValue: myCustomTooltipDefaults
    }
  ],
})
export class GroupedAlignmentsComponent implements OnInit {
  private approximateMatches: boolean;
  private colorActivities: boolean;
  private hideInvisible: boolean;
  private highlight: boolean;
  private searchText;
  private ordering: String;

  private orderingValues;
  private orderingFunction;

  private view: number;

  private alignments;

  private statistics;

  constructor(private configService: ConfigsService, private router:Router) { 
    this.approximateMatches = true;
    this.colorActivities = false;
    this.hideInvisible = false;
    this.highlight = false;
    this.ordering = "COUNT_DESC";

    this.view = 1;

    this.statistics = [
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

    this.orderingValues = [
      {
        label: "Count (Desc)",
        value: "COUNT_DESC"
      },
      {
        label: "Count (Asc)",
        value: "COUNT_ASC"
      },
      {
        label: "Fitness (Desc)",
        value: "FITNESS_DESC"
      },
      {
        label: "Fitness (Asc)",
        value: "FITNESS_ASC"
      },
      {
        label: "Length (Desc)",
        value: "LENGTH_DESC"
      },
      {
        label: "Length (Asc)",
        value: "LENGTH_ASC"
      }
    ]

    this.orderingFunction = {
      "COUNT_DESC": function(a, b) {
        return a.list.length > b.list.length
      },
      "COUNT_ASC": function(a, b) {
        return a.list.length < b.list.length
      },
      "FITNESS_DESC": function(a, b) {
        return a.averageFitness > b.averageFitness
      },
      "FITNESS_ASC": function(a, b) {
        return a.averageFitness < b.averageFitness
      },
      "LENGTH_DESC": function(a, b) {
        return a.averageLength > b.averageLength
      },
      "LENGTH_ASC": function(a, b) {
        return a.averageLength < b.averageLength
      }
    }

    this.alignments = []

    // this.createTransitionsColors()


  }

  ngOnInit() {
    this.configService.getAlignmentsGroups().subscribe((resp) => {
      console.log(resp)
      let labelMap = {}
      
      this.alignments = resp.groups.map((obj) => {
        let newObj = {
          averageLength: obj.averageLength,
          size: obj.size,
          fitness: Math.round(parseFloat(obj.fitness) * 10000)/100 + "%"
        }
        let list = []
        for(let i=0; i<obj.steps.length; i++) {
          let labels = labelMap[obj.steps[i].label];
          if(labels == null) {
            labels = this.divideText(obj.steps[i].label)
            labelMap[obj.steps[i]] = labels;
          }
          
          list.push({
            labelMin: labels.labelMin,
            labelMax: labels.labelMax,
            type: this.getType(obj ,i),
            transitionColor: obj.transitionCol
          })
        }
        newObj['list'] = list;
        return newObj;
      })
      console.log(this.alignments)
    })
  }

  getType(obj, i) {
    if(obj.moveTypes[i].moveType === 'MODEL') {
      if(obj.invisible[i]) {
        return obj.moveTypes[i].dataMoveType === 'CORRECT' ? 'invisible' : 'wrong_data'
      }
      return 'model_only'
    }
    else if(obj.moveTypes[i].moveType === 'LOG')
      return 'log_only'
    else if(obj.moveTypes[i].moveType === 'SYNCHRONOUS')
      return obj.moveTypes[i].dataMoveType === 'CORRECT' ? 'perfect' : 'wrong_data'
    else
      return null
  }

  search() {
    // called when checkbox sub-string matches or search are called
  }

  order() {
    // called by ordering select
  }

  updateVisualization() {
    // called by 3 right checkboxes
  }

  divideText(label) {
    let calc = document.createElement('canvas').getContext("2d");
    calc.font = "8px Arial";
    return {
      labelMin: this.splitByWidth(label, calc, 50-6),
      labelMax: this.splitByWidth(label, calc, 100-6)
    }
  }

  splitByWidth(label, calc, maxWidth) {
    let lines = []
    let width = calc.measureText(label).width
    if(width > maxWidth) {
      let words = label.split(' ')
      let text = words[0]
      for(let i=1; i<words.length; i++) {
        if(calc.measureText(text + " " + words[i]).width < maxWidth)
          text += " " + words[i]
        else {
          lines.push(text)
          text = words[i]
        }
      }
      return lines
    }
    else
      return [label]
  }

  createTransitionsColors() {
    let labelToColor = {}
    for(let alignment of this.alignments) {
      for(let segment of alignment.list) {
        if(labelToColor[segment.label] == null)
          labelToColor[segment.label] = this.getRandomColor()
        segment.transitionColor = labelToColor[segment.label]
      }
    }
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  page(p) {
    this.view = p;
  }

  getIcon(fitness) {
    fitness = parseInt(fitness)
    if(fitness >= 95)
      return "sentiment_very_satisfied"
    else if(fitness >= 80)
      return "sentiment_satisfied"
    else if(fitness >= 80)
      return "sentiment_dissatisfied"
    else if(fitness >= 80)
      return "sentiment_very_dissatisfied"
    else 
      return "mood_bad"
  }

  getIconColor(fitness) {
    fitness = parseInt(fitness)
    if(fitness >= 95)
      return "good"
    else if(fitness >= 80)
      return "not-good"
    else if(fitness >= 80)
      return "bad"
    else if(fitness >= 80)
      return "very-bad"
    else 
      return "worst"
  }
}