import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SliderParams} from '../Types'
import { ConfigsService } from '../configs.service'
import { DefaultSettings } from '../Types'


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
    {value: 'ILP_LPSOLVE', viewValue: 'LpSolve'},
    {value: 'ILP_GUROBI', viewValue: 'Gurobi'}
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

  threads: SliderParams

  fitness: SliderParams

  search_space: SliderParams

  formGroup: FormGroup

  constructor(private configService: ConfigsService) {
    this.fitness = new SliderParams(0, 1, 1, 0.01)
    this.threads = new SliderParams(1, 1, 1, 1)
    this.search_space = new SliderParams(1, 1, 1, 1)


    this.formGroup = new FormGroup({
      threads: new FormControl(1),
      fitness: new FormControl(this.fitness.defaultValue),
      search_space: new FormControl(1),
      checked: new FormControl(false),
      unassigned: new FormControl('NULL'),
      milp: new FormControl('ILP_LPSOLVE'),
      algorithm: new FormControl('ASTAR_GRAPH'),
      balanced: new FormControl(true),
      keep_control: new FormControl(true),
      keep_data: new FormControl(true),
      cache: new FormControl(true),
      optimization: new FormControl(true),
      moves_ordering: new FormControl('LOGMOVEFIRST'),
      queueing: new FormControl('DEPTHFIRST')
    })
  }

  ngOnInit() {
    this.configService.getParameters().subscribe(
      (params: DefaultSettings) => {
        this.threads = new SliderParams(1, params.maxThreads, params.maxThreads, 1)
        
        this.search_space = new SliderParams(1, params.maxSearchSpace, params.defaultSearchSpace, 1)
        
        this.formGroup.controls['threads'].setValue(this.threads.defaultValue)
        this.formGroup.controls['search_space'].setValue(this.search_space.defaultValue)
      }
    )
  }

  public postResult() {
    this.configService.postParameters(this.formGroup.value)
  }
}