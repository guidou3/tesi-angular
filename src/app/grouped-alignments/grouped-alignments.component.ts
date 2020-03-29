import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

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

  private data;
  private data_shown;

  private alignments;

  private statistics = [
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

  constructor() { 
    this.approximateMatches = true;
    this.colorActivities = false;
    this.hideInvisible = false;
    this.highlight = false;
    this.ordering = "COUNT_DESC";

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

    this.alignments = [
      [ 
        {
          label: "1",
          type: "perfect",
          transitionColor:"red"
        },
        {
          label: "2",
          type: "perfect"
        },
        {
          label: "3",
          type: "log_only"
        },
        {
          label: "4",
          type: "model_only"
        },
        {
          label: "5",
          type: "invisible"
        },
        {
          label: "6",
          type: "data"
        },
      ],
      [ 
        {
          label: "1",
          type: "perfect"
        },
        {
          label: "2",
          type: "perfect"
        },
        {
          label: "3",
          type: "log_only"
        },
        {
          label: "4",
          type: "model_only"
        },
        {
          label: "5",
          type: "invisible"
        },
        {
          label: "6",
          type: "data"
        },
      ]
    ]

    this.createTransitionsColors()
  }

  ngOnInit() {
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

  createTransitionsColors() {
    let labelToColor = {}
    for(let alignment of this.alignments) {
      for(let segment of alignment) {
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

  lookup() {
    console.log("approximateMatches " + this.approximateMatches)
    console.log("colorActivities " + this.colorActivities)
    console.log("hideInvisible " + this.hideInvisible)
    console.log("highlight " + this.highlight)
  }

}