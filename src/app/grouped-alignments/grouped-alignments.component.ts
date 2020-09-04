import { Component, OnInit, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ConfigsService } from "../configs.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DialogView } from "./dialog-view";

import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions
} from "@angular/material/tooltip";

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 10000,
  hideDelay: 1000,
  touchendHideDelay: 1000
};

@Component({
  selector: "app-grouped-alignments",
  templateUrl: "./grouped-alignments.component.html",
  styleUrls: ["./grouped-alignments.component.css"],
  providers: [
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: myCustomTooltipDefaults
    }
  ]
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
  private orderingValues_1;
  private orderingValues_2;
  private orderingFunction;

  private view: number;

  private alignments;
  private steps;

  private statistics;

  private variables;

  private transitionToBpmn;

  private constraintsFile;

  private constraints;

  constructor(
    private configService: ConfigsService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.approximateMatches = true;
    this.colorActivities = false;
    this.hideInvisible = true;
    this.highlight = false;
    this.ordering = "RELEVANCE_DESC";

    this.view = 1;

    this.constraints = []

    this.columnDefs = [
      {
        headerName: "Statistic",
        field: "statistic"
      },
      {
        headerName: "Value",
        field: "value"
      }
    ];

    this.statistics = [];

    this.orderingValues_2 = [
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
      }
    ];

    this.orderingValues_1 = this.orderingValues_2.concat([
      {
        label: "Length (Desc)",
        value: "LENGTH_DESC"
      },
      {
        label: "Length (Asc)",
        value: "LENGTH_ASC"
      }
    ]);

    this.orderingValues = this.orderingValues_1;

    this.orderingFunction = {
      RELEVANCE_DESC: function(a, b) {
        if (a.relevance === b.relevance) return a.size < b.size;
        else return a.relevance < b.relevance;
      },
      RELEVANCE_ASC: function(a, b) {
        if (a.relevance === b.relevance) return a.size > b.size;
        else return a.relevance > b.relevance;
      },
      COUNT_DESC: function(a, b) {
        return a.size < b.size;
      },
      COUNT_ASC: function(a, b) {
        return a.size > b.size;
      },
      FITNESS_DESC: function(a, b) {
        return a.fitnessValue < b.fitnessValue;
      },
      FITNESS_ASC: function(a, b) {
        return a.fitnessValue > b.fitnessValue;
      },
      LENGTH_DESC: function(a, b) {
        return a.averageLength < b.averageLength;
      },
      LENGTH_ASC: function(a, b) {
        return a.averageLength > b.averageLength;
      }
    };

    this.alignments = [];

    this.variables = [];

    // this.createTransitionsColors()
  }

  ngOnInit() {
    this.configService.getAlignmentsGroups().subscribe(data => {
      let labelMap = {};
      console.log(data)
      this.transitionToBpmn = data.activityGraphDetails;
      this.constraintsFile = data.customElements;

      let totalConstraintsFitness = 0;
      let totalConstraints = 0;

      if(data.constraints) {
        this.constraints = Object.keys(data.constraints).map(key => {
          let obj = data.constraints[key]
          let label = obj.type
          if(label === "Consequence" || label === "ConsequenceTimed" || label === "TimeDistance")
            label += " from " + obj.source + " to " + obj.target
          else if(obj.transitions){
            label += " linking "
            let first = true
            obj.transitions.forEach(t => {
              if(first) 
                first = false
              else
                label += ", "
              label += t
            })
          }
          totalConstraintsFitness += obj.fitnessValue
          totalConstraints += obj.correct + obj.wrong + obj.missing
          let iconData = this.getIcon(obj.fitnessValue)
          return {
            label: label,
            fitness: obj.fitness,
            fitnessValue: obj.fitnessValue,
            cases: obj.correct + obj.wrong + obj.missing,
            correct: obj.correct,
            wrong: obj.wrong,
            missing: obj.missing,
            icon: iconData.icon,
            color: iconData.color
          }
        })
        
        totalConstraintsFitness /= this.constraints.length
      }
        

      this.alignments = data.groups.map(alignment => {

        let newAlignment = Object.assign(alignment, this.getIcon(alignment.fitnessValue))

        let list = [];
        newAlignment["list"] = alignment.steps.map(step => {
          let labels = labelMap[step.label];
          if (labels == null) {
            labels = this.divideText(step.label);
            labelMap[step.label] = labels;
          }

          return {
            labelMin: labels.labelMin,
            labelMax: labels.labelMax,
            label: step.label,
            transitionColor: step.transitionColor,
            type: this.getType(step),
            missingVariables: step.missingVariables || [],
            incorrectVariables: step.incorrectVariables || []
          };
        });

        return newAlignment;
      });
      let result = this.alignments.reduce(
        (res, current) => {
          /*current.constraints.forEach(con => {
            if (con.result && con.transitions.length > 1) {
              res.constraints.correct += current.size;
            } else if (con.result) res.constraints.partial += current.size;
            else res.constraints.incorrect += current.size;
          });*/
          res.traces += current.size;
          res.sum += current.fitnessValue * current.size;
          res.values.push({
            fitness: current.fitnessValue,
            tot: current.size
          });

          let steps_occurrencies = {};

          current.list.forEach(obj => {
            if (obj.type === "perfect") res.perfect += current.size;
            else if (obj.type === "wrong_data") {
              res.wrong_data += current.size;
              if(res.variables[obj.label] == null) {
                res.variables[obj.label] = {
                  missing: {},
                  incorrect: {}
                }
              }
              obj.missingVariables.forEach((missing) => {
                if(res.variables[obj.label].missing[missing._1] != null)
                  res.variables[obj.label].missing[missing._1] += current.size;
                else
                  res.variables[obj.label].missing[missing._1] = current.size;
              })
              obj.incorrectVariables.forEach((incorrect) => {
                if(res.variables[obj.label].incorrect[incorrect.variable] != null)
                  res.variables[obj.label].incorrect[incorrect.variable] += current.size;
                else
                  res.variables[obj.label].incorrect[incorrect.variable] = current.size;
              })
            }
            else if (obj.type === "model_only") res.model += current.size;
            else if (obj.type === "log_only") res.log += current.size;

            if (obj.type !== "invisible") {
              let label = obj.labelMin.join(" ");
              steps_occurrencies[label] = steps_occurrencies[label] + 1 || 1;
            }
          });

          return res;
        },
        {
          /*constraints: {
            correct: 0,
            partial: 0,
            incorrect: 0
          },*/
          steps: {},
          variables: {},
          traces: 0,
          sum: 0,
          values: [],
          perfect: 0,
          wrong_data: 0,
          model: 0,
          log: 0
        }
      );
      
      let activityToWrongData = {}
      let activityToWrongDataPercentage = {}
      this.steps = this.transitionToBpmn.map(stepData => {
        let total = stepData.cases.reduce((res, n) => res+n, 0)
        let step = {
          label: stepData.label,
          perfect: stepData.cases[0],
          log: stepData.cases[2],
          model: stepData.cases[3],
          wrong_data: stepData.cases[1],
          fitnessValue: stepData.cases[0]/total,
          size: total / result.traces,
        }
        activityToWrongData[stepData.label] = stepData.cases[1]

        step['fitness'] = this.getPercentage(step.fitnessValue);
        step['cases'] = this.getPercentage(step.size);
        step['relevance'] = step.size * (1 - step.fitnessValue);

        activityToWrongDataPercentage[stepData.label] = this.getPercentage(stepData.cases[1]/total)

        let iconData = this.getIcon(step.fitnessValue)
        step.icon = iconData.icon;
        step.color = iconData.color
        return step;
      });

      let half = Math.floor(result.traces / 2);

      result.values.sort((a, b) => a.fitness > b.fitness);
      let median = 0,
        current = 0;
      while (current < half) {
        median++;
        current += result.values[median].tot;
      }
      if (result.values.length % 2 || half + 1 <= current)
        median = result.values[median].fitness;
      else median = (result.values[median] + result.values[median + 1]) / 2.0;

      let total =
        result.perfect + result.wrong_data + result.model + result.log;

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
          value: this.getPercentage(result.values[0].fitness)
        },
        {
          statistic: "Average Fitness",
          value: this.getPercentage(result.sum / result.traces)
        },
        {
          statistic: "Median Fitness",
          value: this.getPercentage(median)
        },
        {
          statistic: "Max Fitness",
          value: this.getPercentage(
            result.values[result.values.length - 1].fitness
          )
        },
        {
          statistic: "Perfect steps",
          value: this.getPercentage(result.perfect / total)
        },
        {
          statistic: "Wrong data steps",
          value: this.getPercentage(result.wrong_data / total)
        },
        {
          statistic: "Model only steps",
          value: this.getPercentage(result.model / total)
        },
        {
          statistic: "Log only steps",
          value: this.getPercentage(result.log / total)
        }
      ];

      this.variables = Object.keys(result.variables).map((activity) => {
        let missing = result.variables[activity].missing
        let incorrect = result.variables[activity].incorrect
        return {
          activity: activity,
          cases: activityToWrongDataPercentage[activity],
          missing: Object.keys(missing).map((variable) => {
            return {
              variable: this.getShorterVariableName(variable),
              percentage: this.getPercentage(missing[variable] / activityToWrongData[activity])
            }
          }) || [],
          incorrect: Object.keys(incorrect).map((variable) => {
            return {
              variable: this.getShorterVariableName(variable),
              percentage: this.getPercentage(incorrect[variable] / activityToWrongData[activity])
            }
          }) || []
        }
      })

      if (this.constraints > 0)
        this.statistics = this.statistics.concat([
          {
            statistic: "Total Constraints",
            value: totalConstraints
          },
          {
            statistic: "Correct Constraints",
            value: this.getPercentage(
              totalConstraintsFitness
            )
          },
          /*{
            statistic: "Partial Constraints",
            value: this.getPercentage(result.constraints.partial / (result.constraints.correct + result.constraints.incorrect))
          },*/
          {
            statistic: "Wrong Constraints",
            value: this.getPercentage(
              1 - totalConstraintsFitness
            )
          }
        ]);

      this.order();
    });
  }

  /**
   * Returns the value as percentage.
   *
   * @param value - The number in input
   * @returns The percentage to the second decimal of 'value'.
   */

  getPercentage(value) {
    return Math.round(parseFloat(value) * 10000) / 100 + "%";
  }

  /**
   * Resize the table to fit the page's width.
   *
   * @param params - Parameters of the table
   */

  public onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  /**
   * Returns the type of the step.
   *
   * @returns The type inferred from the filds of step.
   */

  getType(step) {
    if (step.moveType.moveType === "MODEL") {
      if (step.invisible) {
        return step.moveType.dataMoveType === "CORRECT"
          ? "invisible"
          : "wrong_data";
      }
      return "model_only";
    } else if (step.moveType.moveType === "LOG") return "log_only";
    else if (step.moveType.moveType === "SYNCHRONOUS")
      return step.moveType.dataMoveType === "CORRECT"
        ? "perfect"
        : "wrong_data";
    else return null;
  }

  /**
   * Filter the alignments' groups by searched string.
   *
   * @param string - String written in the search box
   */

  search(string) {
    // called when checkbox sub-string matches or search are called
  }

  /**
   * Orders the alignments' groups, or the steps, by ordering option.
   */

  order() {
    let fun = this.orderingFunction[this.ordering];
    if (this.view < 3) this.alignments.sort(fun);
    else this.steps.sort(fun);
  }

  /**
   * Returns two arrays a label is divided in 'pieces' of a certain width.
   *
   * @param label - The text in input
   * 
   * @returns An object with two arrays for the representation of the given label depending on the width (used in alignment-view)
   */

  divideText(label) {
    let calc = document.createElement("canvas").getContext("2d");
    calc.font = "8px Arial";
    return {
      labelMin: this.splitByWidth(label, calc, 60 - 6),
      labelMax: this.splitByWidth(label, calc, 90 - 6)
    };
  }

  /**
   * Returns an array where the length of every element is less than the given width
   *
   * @param label - The text in input
   * @param calc - The element that calculates the text width
   * @param maxWidth - The max width of a fragment
   * 
   * @returns An array containing the text divided in substrings smaller than the max width.
   */

  splitByWidth(label, calc, maxWidth) {
    let lines = [];
    let width = calc.measureText(label).width;
    if (width > maxWidth) {
      let words = label.split(" ");
      let text = words[0];
      for (let i = 1; i < words.length; i++) {
        if (calc.measureText(text + " " + words[i]).width < maxWidth)
          text += " " + words[i];
        else {
          lines.push(text);
          text = words[i];
        }
      }
      lines.push(text);
      return lines;
    } else return [label];
  }

  /*createTransitionsColors() {
    let labelToColor = {};
    for (let alignment of this.alignments) {
      for (let segment of alignment.list) {
        if (labelToColor[segment.label] == null)
          labelToColor[segment.label] = this.getRandomColor();
        segment.transitionColor = labelToColor[segment.label];
      }
    }
  }*/

  /*getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return "#" + ("000000" + color).slice(-6);
  }*/

  /**
   * Change the currently displayed page
   *
   * @param p - The page's index
   */

  page(p) {
    this.view = p;
    if (this.view < 3) this.orderingValues = this.orderingValues_1;
    else this.orderingValues = this.orderingValues_2;

    this.ordering = "RELEVANCE_DESC";
    this.order();
  }

  /**
   * Returns the data for the alignment group's icon depeding on the fitness
   *
   * @param fitnnes - The fitness of the current alignment group
   * 
   * @returns An object containing the labels for the icon and its color
   */

  getIcon(fitness) {
    if (fitness >= 0.95) 
      return {
        icon:"sentiment_very_satisfied",
        color: "good"
      };
    else if (fitness >= 0.80) 
      return {
        icon:"sentiment_satisfied",
        color: "not-good"
      };
    else if (fitness >= 0.60) 
      return {
        icon:"sentiment_dissatisfied",
        color: "bad"
      };
    else if (fitness >= 0.30) 
      return {
        icon:"sentiment_very_dissatisfied",
        color: "very-bad"
      };
    else 
      return {
        icon:"mood_bad",
        color: "worst"
      };
  }

  /**
   * Opens the dialog to the corresponding alignment group
   *
   * @param index - The index of the alignment group
   */

  openDialog(index) {
    let data = {
      alignment: this.alignments[index],
      hightlight: this.highlight
    };

    const dialogRef = this.dialog.open(DialogView, {
      width: "80%",
      data: data
    });
  }

  /**
   * Saves the json file containing the data to project the result on the initial bpmn (used to add colors on the editor)
   */

  saveJson() {
    var link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    link.setAttribute("download", "graphData.json");
    link.setAttribute(
      "href",
      "data:text/json;charset=UTF-8," +
        encodeURIComponent(JSON.stringify(this.transitionToBpmn))
    );
    link.click();
  }

  saveJsonConstraints() {
    var link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    link.setAttribute("download", "graphData.cbpmn");
    link.setAttribute(
      "href",
      "data:text/json;charset=UTF-8," +
        encodeURIComponent(JSON.stringify(this.constraintsFile))
    );
    link.click();
  }

  getShorterVariableName(name: string) {
    if(name.startsWith('custom:')) {
      if(name.includes('Resource'))
        name = 'Resource'
      else if(name.includes('Role'))
        name = 'Role'
      else if(name.includes('Group'))
        name = 'Group'
      else if(name.includes('TimeInstance'))
        name = 'Time Instance'
      else if(name.includes('TimeVar'))
        name = 'Time'
    }

    return name
  }
}
