import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-grouped-alignments',
  templateUrl: './grouped-alignments.component.html',
  styleUrls: ['./grouped-alignments.component.css']
})
export class GroupedAlignmentsComponent implements OnInit {
  private approximateMatches: boolean;
  private colorActivities: boolean;
  private unobserveable: boolean;
  private searchText;

  constructor() { 
    this.approximateMatches = true;
    this.colorActivities = false;
    this.unobserveable = false;

    
  }

  ngOnInit() {
  }

}