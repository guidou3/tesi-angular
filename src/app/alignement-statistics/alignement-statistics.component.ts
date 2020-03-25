import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alignement-statistics',
  templateUrl: './alignement-statistics.component.html',
  styleUrls: ['./alignement-statistics.component.css']
})
export class AlignementStatisticsComponent implements OnInit {
  private columnDefs1;
  @Input() statistics;
  constructor() {
    this.columnDefs1 = [
      {
        headerName: 'Name',
        field: 'name'
      },
      {
        headerName: 'Value',
        field: 'value',
      }
    ];
  }

  ngOnInit() {
  }

}