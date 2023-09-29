import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './common/services/auth-guard.service';
import { UserLoginComponent } from './users/user-login/user-login.component';

const routes: Routes = [
  {
    path:'',redirectTo:'/login' , pathMatch:'full'
  },
  {
    path:'login', component:UserLoginComponent
  },
  { path: 'work-item', loadChildren: () => import('./workItem/work-item.module').then(m => m.WorkItemModule),
   canActivate: [AuthGuardService]},
  
  { path: 'time-logs', loadChildren: () => import('./timeLogs/time-logs/time-logs.module').then(m => m.TimeLogsModule) },
  { path: 'leave-request', loadChildren: () => import('./leave-request/leave-request/leave-request.module').then(m => m.LeaveRequestModule) },
  { path: 'service-request', loadChildren: () => import('./service-request/service-request/service-request.module').then(m => m.ServiceRequestModule) },
  { path: 'timeSheets', loadChildren: () => import('./common/TimeSheets/time-sheets/time-sheets.module').then(m => m.TimeSheetsModule) },
  { path: 'pbWorkItem', loadChildren: () => import('./Project Backlog/pb-work-item/pb-work-item.module').then(m => m.PbWorkItemModule) },
  { path: 'attendance', loadChildren: () => import('./Attendance/attendance/attendance.module').then(m => m.AttendanceModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
