import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/common/services/auth-guard.service';
import { AddServiceRequestComponent } from './add-service-request/add-service-request.component';
import { UpdateServiceRequestComponent } from './update-service-request/update-service-request.component';
import { ViewServiceRequestComponent } from './view-service-request/view-service-request.component';

const routes: Routes = [
  {
    path: 'add-serviceRequest',
    component: AddServiceRequestComponent,
    canActivate: [AuthGuardService]
  },
{
  path:'view-serviceRequest',
  component: ViewServiceRequestComponent,
  canActivate:[AuthGuardService]
},
{
  path:'edit-serviceRequest',
  component: UpdateServiceRequestComponent,
  canActivate:[AuthGuardService]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRequestRoutingModule { }
