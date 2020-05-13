import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SliderParams} from '../Types'
import { ConfigsService } from '../configs.service'
import { DefaultSettings } from '../Types'


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  private unassigned: {value: string, viewValue: string}[];
  private milp: {value: string, viewValue: string}[];
  private algorithms: {value: string, viewValue: string}[];
  private moves: {value: string, viewValue: string}[];
  private queueing: {value: string, viewValue: string}[];

  private threads: SliderParams
  private fitness: SliderParams
  private search_space: SliderParams

  private formGroup: FormGroup

  constructor(private configService: ConfigsService) {
    this.fitness = new SliderParams(0, 1, 0, 0.01)
    this.threads = new SliderParams(1, 1, 1, 1)
    this.search_space = new SliderParams(1, 1, 1, 1)


    this.formGroup = new FormGroup({
      threads: new FormControl(1),
      fitness: new FormControl(this.fitness.defaultValue),
      evaluation: new FormControl(false),
      startComplete: new FormControl(false),
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

    this.unassigned = [
      {value: 'NULL', viewValue: 'NULL'},
      {value: 'DEFAULT', viewValue: 'DEFAULT'},
      {value: 'FREE', viewValue: 'FREE'}
    ];

    this.milp = [
      {value: 'ILP_LPSOLVE', viewValue: 'LpSolve'},
      {value: 'ILP_GUROBI', viewValue: 'Gurobi'}
    ];

    this.algorithms = [
      {value: 'DIJKSTRA', viewValue: 'Dijkstra'},
      {value: 'ASTAR_TREE', viewValue: 'A* Tree'},
      {value: 'ASTAR_GRAPH', viewValue: 'A* Graph'}
    ];

    this.moves = [
      {value: 'NONE', viewValue: 'None'},
      {value: 'LOGMOVEFIRST', viewValue: 'Log moves first'},
      {value: 'MODELMOVEFIRST', viewValue: 'Model moves first'},
    ];

    this.queueing = [
      {value: 'DEPTHFIRST', viewValue: 'Depth first'},
      {value: 'BREADTHFIRST', viewValue: 'Breadth first'},
      {value: 'DEPTHFIRSTWITHCERTAINTYPRIORITY', viewValue: 'Depth first with certainty priority'},
      {value: 'BREADTHFIRSTWITHCERTAINTYPRIORITY', viewValue: 'Breadth first with certainty priority'},
      {value: 'RANDOM', viewValue: 'Random'}
    ]
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

  /**
   * Posts the configuration
   */

  public postResult() {
    this.configService.postParameters(this.formGroup.value)
  }
}