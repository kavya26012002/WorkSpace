import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeLogsRoutingModule } from './time-logs-routing.module';
import { ViewTimelogsComponent } from './view-timelogs/view-timelogs.component';


@NgModule({
  declarations: [
    
  
    // ViewTimelogsComponent
  ],
  imports: [
    CommonModule,
     TimeLogsRoutingModule
  ]
})
export class TimeLogsModule { }
