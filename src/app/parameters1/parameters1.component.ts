import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parameters1',
  templateUrl: './parameters1.component.html',
  styleUrls: ['./parameters1.component.css']
})
export class Parameters1Component implements OnInit {
  milp = [
    {value: 'NULL', viewValue: 'NULL'},
    {value: 'DEFAULT', viewValue: 'DEFAULT'},
    {value: 'FREE', viewValue: 'FREE'}
  ];


  checked = false

  constructor() { }

  ngOnInit() {
  }

  public isChecked() {
    console.log(this.checked)
  }

  OnChange($event){
    console.log($event); 
    //MatCheckboxChange {checked,MatCheckbox}
}

}