import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-mat-dialog',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatButtonModule,MatIconModule],
  templateUrl: './mat-dialog.component.html',
  styleUrl: './mat-dialog.component.scss'
})


export class MatDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
