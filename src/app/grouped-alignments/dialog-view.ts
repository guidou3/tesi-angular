import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'dialog-view',
  templateUrl: 'dialog.html',
})
export class DialogView {
  private alignment;
  private highlight;

  constructor(
    public dialogRef: MatDialogRef<DialogView>,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.alignment = data.alignment;
      this.highlight = data.highlight;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}