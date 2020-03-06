import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SliderParams} from './parameters'
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http'

@Component({
  selector: 'app-parameters1',
  templateUrl: './parameters1.component.html',
  styleUrls: ['./parameters1.component.css']
})
export class Parameters1Component implements OnInit {
  unassigned = [
    {value: 'NULL', viewValue: 'NULL'},
    {value: 'DEFAULT', viewValue: 'DEFAULT'},
    {value: 'FREE', viewValue: 'FREE'}
  ];
  milp = [
    {value: 'LpSolve', viewValue: 'LpSolve (Bundled)'},
    {value: 'Gurobi', viewValue: 'Gurobi'}
  ];
  algorithms = [
    {value: 'DIJKSTRA', viewValue: 'Dijkstra'},
    {value: 'ASTAR_TREE', viewValue: 'A* Tree'},
    {value: 'ASTAR_GRAPH', viewValue: 'A* Graph'}
  ];
  moves = [
    {value: 'NONE', viewValue: 'None'},
    {value: 'LOGMOVEFIRST', viewValue: 'Log moves first'},
    {value: 'MODELMOVEFIRST', viewValue: 'Model moves first'},
  ]
  queueing = [
    {value: 'DEPTHFIRST', viewValue: 'Depth first'},
    {value: 'BREADTHFIRST', viewValue: 'Breadth first'},
    {value: 'DEPTHFIRSTWITHCERTAINTYPRIORITY', viewValue: 'Depth first with certainty priority'},
    {value: 'BREADTHFIRSTWITHCERTAINTYPRIORITY', viewValue: 'Breadth first with certainty priority'},
    {value: 'RANDOM', viewValue: 'Random'}
  ]

  maxThreads = 100
  maxSearchSpace = 80
  defaultSearchSpace = 60

  threads = new SliderParams(1, this.maxThreads, this.maxThreads, 1)

  fitness = new SliderParams(0, 1, 1, 0.01)

  search_space = new SliderParams(1, this.maxSearchSpace, this.defaultSearchSpace, 1)

  formGroup = new FormGroup({
    threads: new FormControl(this.threads.defaultValue),
    fitness: new FormControl(this.fitness.defaultValue),
    search_space: new FormControl(this.search_space.defaultValue),
    checked: new FormControl(false),
    unassigned: new FormControl('NULL'),
    milp: new FormControl('LpSolve'),
    algorithm: new FormControl('ASTAR_GRAPH'),
    balanced: new FormControl(true),
    keep_control: new FormControl(true),
    keep_data: new FormControl(true),
    cache: new FormControl(true),
    optimization: new FormControl(true),
    moves_ordering: new FormControl('LOGMOVEFIRST'),
    queueing: new FormControl('DEPTHFIRST')
  })

  constructor(http: HttpClient) { }

  ngOnInit() {
    
  }

  pulic fetch() {
    this.http.get()
  }

  public isChecked() {
    console.log(this.formGroup.controls['unassigned'].value); 
  }

  OnChange($event){

    console.log(this.formGroup.controls.checked); 
    //MatCheckboxChange {checked,MatCheckbox}
}

}