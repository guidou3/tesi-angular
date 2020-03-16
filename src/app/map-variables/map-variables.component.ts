import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigsService } from '../configs.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-variables',
  templateUrl: './map-variables.component.html',
  styleUrls: ['./map-variables.component.css']
})
export class MapVariablesComponent implements OnInit {
  formGroup: FormGroup

  attention = {}
  internalSet = []
  list = []

  constructor(private configService: ConfigsService, private router:Router) { 
    this.formGroup = new FormGroup({})
  }

  ngOnInit() {
    this.configService.getInitialVariableMapping().subscribe(
      (params: any) => {
        console.log(params)
        this.internalSet = params.internalSet.map(function (obj, id) {
          return {
            value: obj,
            viewValue: obj
          }
        })
        
        const p = this
        Object.keys(params.mapping).forEach(function(key) {
          let val = params.mapping[key]
          if(val.indexOf("<*>") !== -1) {
            val = val.substring(0, val.indexOf("<*>"))
            p.attention[key] = true
          }
          else
            p.attention[key] = false

          p.formGroup.addControl(key, new FormControl(val))
          p.list.push(key)
        })
      }
    )
  }

  public postMapping() {
    this.configService.postVariableMapping(this.formGroup.value).subscribe(resp => {
        console.log(resp)
        this.router.navigateByUrl('dataCost')
      })
  }
}