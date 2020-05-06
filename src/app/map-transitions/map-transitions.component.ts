import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigsService } from '../configs.service'
import { InitialMapping } from '../Types'
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-map-transitions',
  templateUrl: './map-transitions.component.html',
  styleUrls: ['./map-transitions.component.css']
})
export class MapTransitionsComponent implements OnInit {
  formGroup: FormGroup

  private transitionMap;
  private transitions;
  private nameList;
  private resourceList;
  private classifiers;
  private list;
  private invisible;
  private loading;

  constructor(private configService: ConfigsService, private router:Router, private location: Location) { 
    this.formGroup = new FormGroup({
      classifier: new FormControl('NULL'),
      approximated: new FormControl(true)
    })
    this.transitionMap = new Map();
    this.transitions = [];
    this.nameList = [];
    this.resourceList = [];
    this.classifiers = [];
    this.list = [];
    this.invisible = {};
    this.loading = true;
  }

  private removeMapEnding(string) {
    let regex = /[]*_\d*$/
    if(string.search(regex) !== -1) {
      string = string.substring(0, string.lastIndexOf("_"))
    }
    return string;
  }

  ngOnInit() {
    this.configService.getInitialMapping().subscribe(
      (params) => {
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
        
        const p = this
        Object.keys(params.transitionNames).forEach(function(key) {
          if(params.transitionNames[key].length === 1)
            p.invisible[key] = p.list[params.transitionNames[key][0]].value
          else {
            let label = p.list[params.transitionNames[key][0]]
            p.formGroup.addControl(key, new FormControl(label.value))
            p.transitionMap.set(key, params.transitionNames[key])
            p.transitions.push({
              label: p.removeMapEnding(key),
              value: key
            })
          }
        })
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
      if(val.length > 1) {
        let label = p.list[val[index]].value
        p.formGroup.controls[key].setValue(label)
      }
        
    })
  }

  public labelToObj(index) {
    let n = this.getIndex()
    let list = []

    if(n < 2) list = this.nameList
    else list = this.resourceList

    return list[index].value
  }

  public back() {
    this.location.back()
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
    let invisibles = this.invisible
    Object.keys(invisibles).forEach(function(key) {
      obj[key] = invisibles[key]
    })
    result['list'] = obj
    this.configService.postMapping(result)
      .subscribe(resp => {
        console.log(resp)
        this.router.navigateByUrl('flowCost')
      })
  }
}