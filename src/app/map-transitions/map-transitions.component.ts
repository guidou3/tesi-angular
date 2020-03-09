import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-map-transitions',
  templateUrl: './map-transitions.component.html',
  styleUrls: ['./map-transitions.component.css']
})
export class MapTransitionsComponent implements OnInit {
  formGroup: FormGroup

  list = [
    {
      modelName: 'Prova',
      default: 'DEFAULT'
    },
    {
      modelName: 'Prova2',
      default: 'FREE'
    }
  ]

  values = [
    {value: 'NULL', viewValue: 'NULL'},
    {value: 'DEFAULT', viewValue: 'DEFAULT'},
    {value: 'FREE', viewValue: 'FREE'}
  ]

  classifiers = [
    {value: 'NULL', viewValue: 'NULL'},
    {value: 'DEFAULT', viewValue: 'DEFAULT'},
    {value: 'FREE', viewValue: 'FREE'}
  ];

  constructor() { 
    this.formGroup = new FormGroup({
      classifier: new FormControl('NULL'),
      approximated: new FormControl(true)
    })

    const p = this
    this.list.forEach(function (obj) {
      p.formGroup.addControl(obj.modelName, new FormControl(obj.default))
    })
  }

  ngOnInit() {
    
  }

}