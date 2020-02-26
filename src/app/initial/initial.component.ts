import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilesService } from '../../files.service';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css']
})
export class InitialComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private filesService: FilesService
    ) {}

  addModel(model) {
    this.filesService.addModel(model);
    window.alert('Your model has been added!');
  }

  addCustomElements(ce) {
    this.filesService.addCustomElements(ce);
    window.alert('Your custom elements have been added!');
  }

  addLog(log) {
    this.filesService.addLog(log);
    window.alert('Your log has been added!');
  }

  ngOnInit() {
  }

}