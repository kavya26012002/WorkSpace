import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PbWorkItemRoutingModule } from './pb-work-item-routing.module';
import { ViewPbWorkitemComponent } from './view-pb-workitem/view-pb-workitem.component';
import { AddattachmentComponent } from './addattachment/addattachment.component';
import { ManageWorkItemComponent } from './manage-work-item/manage-work-item.component';


@NgModule({
  declarations: [
    ],
  imports: [
    CommonModule,
    PbWorkItemRoutingModule
  ]
})
export class PbWorkItemModule { }
