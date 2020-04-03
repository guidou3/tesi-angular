import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alignment-statistics',
  templateUrl: './alignment-statistics.component.html',
  styleUrls: ['./alignment-statistics.component.css']
})
export class AlignmentStatisticsComponent implements OnInit {
  private columnDefs1;
  @Input() statistics;
  constructor() {
    this.columnDefs1 = [
      {
        headerName: 'Statistic',
        field: 'statistic'
      },
      {
        headerName: 'Value',
        field: 'value',
      }
    ];
  }

  ngOnInit() {
  }

  public onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

}
