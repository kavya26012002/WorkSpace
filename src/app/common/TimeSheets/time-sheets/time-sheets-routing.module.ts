import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { ViewTimeSheetComponent } from './view-time-sheet/view-time-sheet.component';

const routes: Routes = [
  {
    path: 'view-timeSheet',
    component: ViewTimeSheetComponent,
    canActivate: [AuthGuardService]
  }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeSheetsRoutingModule { }
