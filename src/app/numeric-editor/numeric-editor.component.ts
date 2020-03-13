import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-numeric-editor',
  templateUrl: './numeric-editor.component.html',
  styleUrls: ['./numeric-editor.component.css']
})
export class NumericEditorComponent {
  @ViewChild('i', {static: true}) textInput;
  params;
  
  agInit(params: any): void {
    this.params = params;
  }

  getValue() {
    return this.textInput.nativeElement.value;
  }

  onKeyPress(event) {
    if (!isNumeric(event)) {
      event.preventDefault();
    }

    function isNumeric(ev) {
      return /\d*\.?\d*/.test(ev.key);
    }
  }

  prova(event) {
    console.log("called")
  }

  onKeyDown(event) {
    if (event.keyCode === 39 || event.keyCode === 37) {
      event.stopPropagation();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.textInput.nativeElement.focus();
    });
  }

}