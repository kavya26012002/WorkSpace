import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/common/services/auth-guard.service';
import { ManageWorkItemComponent } from './manage-work-item/manage-work-item.component';
import {  ViewPbWorkitemComponent } from './view-pb-workitem/view-pb-workitem.component';

const routes: Routes = [
  {
    path: 'view-WorkItem',
    component: ViewPbWorkitemComponent,
    canActivate: [AuthGuardService]
  },
{
  path:'manage-workItem',
  component:ManageWorkItemComponent,
  canActivate:[AuthGuardService]
}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PbWorkItemRoutingModule { }
