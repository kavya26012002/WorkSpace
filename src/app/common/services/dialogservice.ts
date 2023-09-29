import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AddattachmentComponent } from 'src/app/Project Backlog/pb-work-item/addattachment/addattachment.component';
import { AddServiceRequestComponent } from 'src/app/service-request/service-request/add-service-request/add-service-request.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
    serviceRequestAdded=new Subject<boolean>();
    serviceRequestrouter=new Subject<string>();

  constructor(private dialog: MatDialog) { }

  openAddServiceRequestModal(): any {
    const dialogRef = this.dialog.open(AddServiceRequestComponent, {
      width: '600px' ,
      position:{top:'55px'},
      panelClass: 'slide-from-top' ,
      height:'max-content'
    });

    dialogRef.afterClosed().subscribe(result => {
       
        if(result === undefined)
        {

            this.serviceRequestAdded.next(result);        
        }
        else{
            this.serviceRequestAdded.next(result);        

        }
    });
  }

  openAddAttachmentModal(projectid:any):any{
    const dialogRef = this.dialog.open(AddattachmentComponent,
      {
        width:'600px',
        position:{top:'55px'},
        panelClass:'slide-from-top',
        height:'max-content',
        data:{projectId:projectid}
      });

  }
}
