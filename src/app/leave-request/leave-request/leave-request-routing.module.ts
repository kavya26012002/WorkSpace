import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/common/services/auth-guard.service';
import { AddLeaveRequestComponent } from './add-leave-request/add-leave-request.component';
import { UpdateLeaveRequestComponent } from './update-leave-request/update-leave-request.component';
import { ViewLeaveRequestComponent } from './view-leave-request/view-leave-request.component';

const routes: Routes = [
  {
    path: 'add-leaveRequest',
    component: AddLeaveRequestComponent,
    canActivate: [AuthGuardService]
  },
{
  path:'view-leaveRequest',
  component: ViewLeaveRequestComponent,
  canActivate:[AuthGuardService]
},
{
  path:'edit-leaveRequest',
  component: UpdateLeaveRequestComponent,
  canActivate:[AuthGuardService]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRequestRoutingModule { }
