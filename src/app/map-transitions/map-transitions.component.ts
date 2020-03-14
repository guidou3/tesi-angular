import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigsService } from '../configs.service'
import { InitialMapping } from '../Types'

@Component({
  selector: 'app-map-transitions',
  templateUrl: './map-transitions.component.html',
  styleUrls: ['./map-transitions.component.css']
})
export class MapTransitionsComponent implements OnInit {
  formGroup: FormGroup

  transitionMap = new Map();
  transitions = []
  nameList = []
  resourceList = []
  classifiers = []
  list = []
  loading = true;

  constructor(private configService: ConfigsService) { 
    this.formGroup = new FormGroup({
      classifier: new FormControl('NULL'),
      approximated: new FormControl(true)
    })
  }

  ngOnInit() {
    this.configService.getInitialMapping().subscribe(
      (params: InitialMapping) => {
        console.log(params)
        this.loading = false
        this.classifiers = params.classifiers.map(function (s) {
          return {
            value: s,
            label: s
          }
        })
        this.formGroup.controls['classifier'].setValue(params.defaultClassifier)

        this.nameList = params.nameList
        this.resourceList = params.resourceList
        this.list = this.nameList
        
        this.transitionMap = new Map()
        const p = this
        Object.keys(params.transitionNames).forEach(function(key) {
          let label = p.list[params.transitionNames[key][0]]
          p.formGroup.addControl(key, new FormControl(label.value))
          p.transitionMap.set(key, params.transitionNames[key])
          p.transitions.push(key)
        })
        /*
        this.nameList.forEach(function (obj) {
          p.formGroup.addControl(obj.modelName, new FormControl(obj.default))
        })*/
      }
    )
  }

  public getIndex() {
    let index = 0;
    if(this.formGroup.controls['classifier'].value !== this.classifiers[0].value) 
      index += 2
    if(!this.formGroup.controls['approximated'].value)
      index++

    return index
  }

  public updateIndex() {
    let index = this.getIndex()

    if(index < 2) this.list = this.nameList
    else this.list = this.resourceList

    const p = this
    this.transitionMap.forEach(function(val, key) {
      if(val.length > 1) 
        p.formGroup.controls[key].setValue(val[index])
    })
  }

  public labelToObj(index) {
    let n = this.getIndex()
    let list = []

    if(n < 2) list = this.nameList
    else list = this.resourceList

    return list[index].value
  }

  public postMapping() {
    let result = {}, obj = {}, copy = this.formGroup.value;
    result['classifier'] = copy.classifier
    const p = this
    Object.keys(copy).forEach(function(key) {
      if(key === 'classifier' || key === 'approximated') {}
      else
        obj[key] = copy[key]
    })
    result['list'] = obj
    console.log(result)
    console.log(this.classifiers)
    this.configService.postMapping(result)
  }
}