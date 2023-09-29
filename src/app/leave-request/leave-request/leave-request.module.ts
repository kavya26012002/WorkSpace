import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewLeaveRequestComponent } from './view-leave-request/view-leave-request.component';
import { AddLeaveRequestComponent } from './add-leave-request/add-leave-request.component';
import { UpdateLeaveRequestComponent } from './update-leave-request/update-leave-request.component';
import { LeaveRequestRoutingModule } from './leave-request-routing.module';



@NgModule({
  declarations: [
   
  
   
  ],
  imports: [
    CommonModule,
     LeaveRequestRoutingModule
  ]
})
export class LeaveRequestModule { }
