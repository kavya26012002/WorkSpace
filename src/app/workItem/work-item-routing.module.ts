import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../common/services/auth-guard.service';
import { AddWorkItemComponent } from './add-work-item/add-work-item.component';
import { EditWorkItemComponent } from './edit-work-item/edit-work-item.component';
import { ViewWorkItemComponent } from './view-work-item/view-work-item.component';

const routes: Routes = [
  {
    path: 'view-workItem',
    component: ViewWorkItemComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'add-workItem',
    component: AddWorkItemComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit-workItem',
    component: EditWorkItemComponent,
    canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkItemRoutingModule {}
