import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { MaterialModule } from './common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { UserLoginComponent } from './users/user-login/user-login.component';
import { ViewWorkItemComponent } from './workItem/view-work-item/view-work-item.component';
import { AddWorkItemComponent } from './workItem/add-work-item/add-work-item.component';
import { EditWorkItemComponent } from './workItem/edit-work-item/edit-work-item.component';
import { GridModule } from '@progress/kendo-angular-grid'; // Import the GridModule
import {MatDialogModule} from '@angular/material/dialog';
import { PopupComponent } from './common/popup/popup/popup.component';
import { DialogBoxComponent } from './common/dialog-box/dialog-box/dialog-box.component';
import { DatePipe } from '@angular/common';
import { ViewTimelogsComponent } from './timeLogs/time-logs/view-timelogs/view-timelogs.component';
import { AddLeaveRequestComponent } from './leave-request/leave-request/add-leave-request/add-leave-request.component';
import { UpdateLeaveRequestComponent } from './leave-request/leave-request/update-leave-request/update-leave-request.component';
import { ViewLeaveRequestComponent } from './leave-request/leave-request/view-leave-request/view-leave-request.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorMessageComponent } from './common/error-message/error-message.component';
import { DeleteDialogComponent } from './common/delete-dialog/delete-dialog.component';
import { AddServiceRequestComponent } from './service-request/service-request/add-service-request/add-service-request.component';
import { UpdateServiceRequestComponent } from './service-request/service-request/update-service-request/update-service-request.component';
import { ViewServiceRequestComponent } from './service-request/service-request/view-service-request/view-service-request.component';
import { EnumValuePipe } from './common/services/enum-value';
import { ViewTimeSheetComponent } from './common/TimeSheets/time-sheets/view-time-sheet/view-time-sheet.component';
import { CurrentMonthComponent } from './common/current-month/current-month.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ProjectTitleTooltipComponent } from './common/project-title-tooltip/project-title-tooltip.component';
import { ViewPbWorkitemComponent } from './Project Backlog/pb-work-item/view-pb-workitem/view-pb-workitem.component';
import { AddattachmentComponent } from './Project Backlog/pb-work-item/addattachment/addattachment.component';
import { ManageWorkItemComponent } from './Project Backlog/pb-work-item/manage-work-item/manage-work-item.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {MatTabsModule} from '@angular/material/tabs';
import { ViewAttendanceComponent } from './Attendance/attendance/view-attendance/view-attendance.component';







@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    UserLoginComponent,
    ViewWorkItemComponent,
    AddWorkItemComponent,
    EditWorkItemComponent,
    PopupComponent,
    DialogBoxComponent,
    ViewTimelogsComponent,
    AddLeaveRequestComponent,
    UpdateLeaveRequestComponent,
    ViewLeaveRequestComponent,
    ErrorMessageComponent,
    DeleteDialogComponent,
    AddServiceRequestComponent,
    UpdateServiceRequestComponent,
    ViewServiceRequestComponent,
    ViewTimeSheetComponent,
    CurrentMonthComponent,
    EnumValuePipe,
    ProjectTitleTooltipComponent,
    ViewPbWorkitemComponent,
    AddattachmentComponent,
    ManageWorkItemComponent,
    ViewAttendanceComponent
    
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    GridModule,
    MatDialogModule,
    MatPaginatorModule,
    TooltipModule,
    CKEditorModule,
    MatTabsModule
    

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
