import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/common/services/auth-guard.service';
import { ViewTimelogsComponent } from './view-timelogs/view-timelogs.component';

const routes: Routes = [
  {
    path: 'view-timeLogs',
    component: ViewTimelogsComponent,
    canActivate: [AuthGuardService]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeLogsRoutingModule { }
