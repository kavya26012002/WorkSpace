import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRequestRoutingModule } from './service-request-routing.module';
import { AddServiceRequestComponent } from './add-service-request/add-service-request.component';
import { UpdateServiceRequestComponent } from './update-service-request/update-service-request.component';
import { ViewServiceRequestComponent } from './view-service-request/view-service-request.component';


@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    ServiceRequestRoutingModule
  ]
})
export class ServiceRequestModule { }
