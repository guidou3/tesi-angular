import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfigsService } from '../configs.service'
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { DialogView } from './dialog-view'

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
  private ordering;
  private columnDefs;

  private orderingValues;
  private orderingFunction;

  private view: number;

  private alignments;

  private statistics;

  constructor(private configService: ConfigsService, private router:Router, private dialog:MatDialog) { 
    this.approximateMatches = true;
    this.colorActivities = false;
    this.hideInvisible = true;
    this.highlight = false;
    this.ordering = "RELEVANCE_DESC";

    this.view = 1;

    this.columnDefs = [
      {
        headerName: 'Statistic',
        field: 'statistic'
      },
      {
        headerName: 'Value',
        field: 'value',
      }
    ];

    this.statistics = []

    this.orderingValues = [
      {
        label: "Relevance (Desc)",
        value: "RELEVANCE_DESC"
      },
      {
        label: "Relevance (Asc)",
        value: "RELEVANCE_ASC"
      },
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
      "RELEVANCE_DESC": function(a, b) {
        if(a.relevance === b.relevance)
          return a.size < b.size
        else 
          return a.relevance < b.relevance
      },
      "RELEVANCE_ASC": function(a, b) {
        if(a.relevance === b.relevance)
          return a.size > b.size
        else 
        return a.relevance > b.relevance
      },
      "COUNT_DESC": function(a, b) {
        return a.size < b.size
      },
      "COUNT_ASC": function(a, b) {
        return a.size > b.size
      },
      "FITNESS_DESC": function(a, b) {
        return a.fitnessValue < b.fitnessValue
      },
      "FITNESS_ASC": function(a, b) {
        return a.fitnessValue > b.fitnessValue
      },
      "LENGTH_DESC": function(a, b) {
        return a.averageLength < b.averageLength
      },
      "LENGTH_ASC": function(a, b) {
        return a.averageLength > b.averageLength
      }
    }

    this.alignments = []

    // this.createTransitionsColors()


  }

  ngOnInit() {
    this.configService.getAlignmentsGroups().subscribe((groups) => {
      console.log(groups)
      let labelMap = {}
      
      this.alignments = groups.map((alignment) => {
        let newObj = {
          averageLength: alignment.averageLength,
          size: alignment.size,
          fitness: Math.round(parseFloat(alignment.fitness) * 10000)/100 + "%",
          fitnessValue: alignment.fitness,
          relevance: alignment.size * (1 - alignment.fitness),
          constraints: alignment.constraints
        }
        let list = []
        newObj['list'] = alignment.steps.map((step) => {
          let labels = labelMap[step.label];
          if(labels == null) {
            labels = this.divideText(step.label)
            labelMap[step.label] = labels;
          }
          
          return {
            labelMin: labels.labelMin,
            labelMax: labels.labelMax,
            transitionColor: step.transitionColor,
            type: this.getType(step),
            missingVariables: step.missingVariables,
            incorrectVariables: step.incorrectVariables
          }
        })
        
        return newObj;
      })

      let result = this.alignments.reduce((res, current) => {
        
        res.traces += current.size
        res.sum += current.fitnessValue
        res.values.push(current.fitnessValue)
        current.list.forEach((obj) => {
          if(obj.type === 'perfect')
            res.perfect += 1
          else if(obj.type === 'wrong_data')
            res.wrong_data += 1
          else if(obj.type === 'model_only')
            res.model += 1
          else if(obj.type === 'log_only')
            res.log += 1
        })
        return res;
      }, {
        traces: 0,
        sum: 0,
        values: [],
        perfect: 0,
        wrong_data: 0,
        model: 0,
        log: 0
      })

      let half = Math.floor(result.values.length / 2);
      result.values.sort()

      this.statistics = [
        {
          statistic: "#Groups",
          value: this.alignments.length
        },
        {
          statistic: "#Traces",
          value: result.traces
        },
        {
          statistic: "Min Fitness",
          value: this.getPercentage(result.values[0])
        },
        {
          statistic: "Average Fitness",
          value: this.getPercentage(result.sum / result.values.length)
        },
        {
          statistic: "Median Fitness",
          value: this.getPercentage(result.values.length % 2 ? result.values[half] : (result.values[half -1] + result.values[half])/ 2.0)
        },
        {
          statistic: "Max Fitness",
          value: this.getPercentage(result.values[result.values.length -1])
        },
        {
          statistic: "Perfect steps",
          value: result.perfect
        },
        {
          statistic: "Wrong data steps",
          value: result.wrong_data
        },
        {
          statistic: "Model only steps",
          value: result.model
        },
        {
          statistic: "Log only steps",
          value: result.log
        }
      ]

      this.order()
    })
  }

  getPercentage(value) {
    return Math.round(parseFloat(value) * 10000)/100 + "%"
  }

  public onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  getType(step) {
    if(step.moveType.moveType === 'MODEL') {
      if(step.invisible) {
        return step.moveType.dataMoveType === 'CORRECT' ? 'invisible' : 'wrong_data'
      }
      return 'model_only'
    }
    else if(step.moveType.moveType === 'LOG')
      return 'log_only'
    else if(step.moveType.moveType === 'SYNCHRONOUS')
      return step.moveType.dataMoveType === 'CORRECT' ? 'perfect' : 'wrong_data'
    else
      return null
  }

  search() {
    // called when checkbox sub-string matches or search are called
  }

  order() {
    let fun = this.orderingFunction[this.ordering];
    this.alignments.sort(fun)
  }

  updateVisualization() {
    // called by 3 right checkboxes
  }

  divideText(label) {
    let calc = document.createElement('canvas').getContext("2d");
    calc.font = "8px Arial";
    return {
      labelMin: this.splitByWidth(label, calc, 60-6),
      labelMax: this.splitByWidth(label, calc, 90-6)
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
      lines.push(text)
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

  openDialog(index) {
    let data = {
      alignment: this.alignments[index],
      hightlight: this.highlight
    }

    const dialogRef = this.dialog.open(DialogView, {
      width: '80%',
      data: data
    });
  }
}



