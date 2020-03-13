import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigsService } from '../configs.service'
import { InitialMapping } from '../Types'

@Component({
  selector: 'app-map-variables',
  templateUrl: './map-variables.component.html',
  styleUrls: ['./map-variables.component.css']
})
export class MapVariablesComponent implements OnInit {
  formGroup: FormGroup

  variablesMap = new Map();
  variables = []
  list = []

  constructor(private configService: ConfigsService) { 
    this.formGroup = new FormGroup({
      classifier: new FormControl('NULL'),
      approximated: new FormControl(true)
    })
  }

  ngOnInit() {
    this.configService.getInitialMapping().subscribe(
      (params: InitialMapping) => {

        this.classifiers = params.classifiers.map(function (obj) {
          return {
            value: obj.name,
            viewValue: obj.name
          }
        })
        this.formGroup.controls['classifier'].setValue(params.defaultClassifier.name)

        this.nameList = params.nameList.map(function (obj, id) {
          if(id === 0) return {
            value: 0,
            viewValue: 'None'
          }
          return {
            value: obj.index+1,
            viewValue: obj.id
          }
        })
        this.list = this.nameList

        this.resourceList = params.resourceList.map(function (obj, id) {
          if(id === 0) return {
            value: 'NONE',
            viewValue: 'None'
          }
          return {
            value: obj.index,
            viewValue: obj.id
          }
        })
        
        this.transitionMap = new Map()
        const p = this
        Object.keys(params.transitionNames).forEach(function(key) {
          p.formGroup.addControl(key, new FormControl(params.transitionNames[key][0]))
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

  public updateIndex() {
    let index = 0;
    if(this.formGroup.controls['classifier'].value !== this.classifiers[0].value) 
      index += 2
    if(!this.formGroup.controls['approximated'].value)
      index++

    if(index < 2) this.list = this.nameList
    else this.list = this.resourceList

    const p = this
    this.transitionMap.forEach(function(val, key) {
      if(val.length > 1) 
        p.formGroup.controls[key].setValue(val[index])
    })
  }

  public postMapping() {
    let result = {}, obj = {}, copy = this.formGroup.value;

    Object.keys(copy).forEach(function(key) {
      if(key === 'classifier')
        result[key] = copy.classifier
      else if(key === 'approximated') {}
      else
        obj[key] = copy[key]
    })
    result['list'] = obj

    this.configService.postMapping(result)
  }
}