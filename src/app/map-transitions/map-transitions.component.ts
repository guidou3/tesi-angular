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

  ngOnInit() {
    this.configService.getInitialMapping().subscribe(
      (params) => {
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
        
        Object.keys(params.transitionNames).forEach((key) => {
          if(params.transitionNames[key].length === 1)
            this.invisible[key] = this.list[params.transitionNames[key][0]].value
          else {
            let label = this.list[params.transitionNames[key][0]]
            this.formGroup.addControl(key, new FormControl(label.value))
            this.transitionMap.set(key, params.transitionNames[key])
            this.transitions.push({
              label: this.removeMapEnding(key),
              value: key
            })
          }
        })
      }
    )
  }

  /**
   * Removes the index at the end of the label if present
   *
   * @param string - The name of the transition
   * 
   * @returns The name of the transition without its index
   */

  private removeMapEnding(string) {
    let regex = /[]*_\d*$/
    if(string.search(regex) !== -1) {
      string = string.substring(0, string.lastIndexOf("_"))
    }
    return string;
  }

  /**
   * Updates the matching elements depeding on the classifier
   */

  public updateIndex() {
    // calculate the index of the classifier
    let index = 0;
    if(this.formGroup.controls['classifier'].value !== this.classifiers[0].value) 
      index += 2
    if(!this.formGroup.controls['approximated'].value)
      index++

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

  /**
   * Posts the transition mapping
   */

  public postMapping() {
    let obj = Object.assign(this.formGroup.value, this.invisible)

    delete obj.classifier;
    delete obj.approximated;

    this.configService.postMapping({
      classifier: this.formGroup.value.classifier,
      list: obj
    }).subscribe(resp => {
        this.router.navigateByUrl('flowCost')
      })
  }
}