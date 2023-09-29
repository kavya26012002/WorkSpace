import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DeleteserviceService {

  constructor(private dialog: MatDialog) {}
 
  openConfirmDialogue(messageFromComponent: string) {
    return this.dialog.open(DeleteDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        message: messageFromComponent,
      },
      height:'220px',
      position:{top:'15px'}
      
    });
  }
}
