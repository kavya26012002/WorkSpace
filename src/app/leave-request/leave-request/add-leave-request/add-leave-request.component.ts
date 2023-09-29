import { BasePortalHost } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogBoxComponent } from 'src/app/common/dialog-box/dialog-box/dialog-box.component';
import { LeaveRequestService } from 'src/app/common/services/leave-request.service';
import { SharedSuccessServiceService } from 'src/app/common/services/shared-success-service.service';
import {   Availibilty, LeaveAttendanceOption } from 'src/app/models/enum';
import { GetEmployeeDetailsViewModelRequest, insertLeaveRequest } from 'src/app/models/leaveRequest';

@Component({
  selector: 'app-add-leave-request',
  templateUrl: './add-leave-request.component.html',
  styleUrls: ['./add-leave-request.component.css'],
})
export class AddLeaveRequestComponent implements OnInit {
  ngOnInit(): void {
    this.loadData();
  }
  private reportingPersonId: number | undefined;

  loadData() {
    const startDate = this.addLeaveRequestForm.get('leaveStartDate')?.value;
    const endDate = this.addLeaveRequestForm.get('leaveEndDate')?.value;
    const formattedstartDate = this.datePipe.transform(startDate ?? '', 'yyyy-MM-dd');
    console.log(formattedstartDate)
    const formattedendDate = this.datePipe.transform(endDate ?? '', 'yyyy-MM-dd');
    console.log(formattedendDate);
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      const request: GetEmployeeDetailsViewModelRequest = {
        EmployeeId: +employeeId,
        StartDate:formattedstartDate,
        EndDate:formattedendDate
      };
      this.leaverequest.getLeaveRequestInsertDetails(request).subscribe({
        next: (response: any) => {
          console.log(response)
          if (
            Array.isArray(response.leaverequestinsertlist) &&
            response.leaverequestinsertlist.length > 0
          ) {
            this.reportingPersonId = response.leaverequestinsertlist[0].reportingPersonId;

            const firstItem = response.leaverequestinsertlist[0];
            this.addLeaveRequestForm
              .get('employeeName')!
              .setValue(firstItem.employeeName);
            this.addLeaveRequestForm
              .get('alternatePhoneNumber')!
              .setValue(firstItem.alternatePhoneNumber);
            this.addLeaveRequestForm
              .get('phoneNumber')!
              .setValue(firstItem.phoneNumber);
            this.addLeaveRequestForm
              .get('reportingPersonName')!
              .setValue(firstItem.reportingPersonName);
            this.addLeaveRequestForm
              .get('duartion')!
              .setValue(firstItem.duration);

            const formattedLeaveEndDate = this.datePipe.transform(
              firstItem.leaveEndDate,
              'yyyy-MM-dd'
            );
            this.addLeaveRequestForm
              .get('leaveEndDate')!
              .setValue(formattedLeaveEndDate);
            const foramttedStartDate = this.datePipe.transform(
              firstItem.leaveStartDate,
              'yyyy-MM-dd'
            );
            this.addLeaveRequestForm
              .get('leaveStartDate')!
              .setValue(foramttedStartDate);
            const formattedReturnDate = this.datePipe.transform(
              firstItem.returnDate,
              'yyyy-MM-dd'
            );
            this.addLeaveRequestForm
              .get('returnDate')!
              .setValue(formattedReturnDate);
            const foramttedRequestedDate = this.datePipe.transform(
              firstItem.requestedDate,
              'yyyy-MM-dd'
            );
            this.addLeaveRequestForm
              .get('requestedDate')!
              .setValue(foramttedRequestedDate);
          }
          console.log(response);
        },
      });
    }
  }
  LeaveAttendanceOption = LeaveAttendanceOption;
  defaultOptionValue: LeaveAttendanceOption = LeaveAttendanceOption.FullDay;
  leaveAttendanceOptions = [
    { value: LeaveAttendanceOption.FullDay, name: 'Full Day' },
    { value: LeaveAttendanceOption.FirstHalf, name: 'First Half' },
    { value: LeaveAttendanceOption.SecondHalf, name: 'Second Half' },
  ];


  Availibilty = Availibilty;
  defaultAvailibiltyOption: Availibilty = Availibilty.Yes;
  AvailibiltyOptions = [
    {
      value: Availibilty.Yes,
      name: 'Yes',
    },
    {
      value: Availibilty.No,
      name: 'No',
    },
  ];
  defaultAdhocOption: string = 'Select';
  dropdownAdhocOptions = [
    { value: 'Select', name: 'Select' },
    { value: 'Informed by team member', name: 'Informed by team member' },
    { value: 'Informed Directly', name: 'Informed Directly' },
    { value: 'Uninformed', name: 'Uninformed' },
  ];

  selectedItemName: string | null = null;
  addLeaveRequestForm: FormGroup = new FormGroup({});
  constructor(
    private dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder,
    private leaverequest: LeaveRequestService,
    private datePipe: DatePipe,
    private successMessageService:SharedSuccessServiceService

  ) {
    this.addLeaveRequestForm = this.formBuilder.group({
      employeeName: [''],
      alternatePhoneNumber: [''],
      phoneNumber: [''],
      reportingPersonName: [''],
      leaveEndDate: [''],
      leaveStartDate: [''],
      duartion: [''],
      returnDate: [''],
      requestedDate: [''],
      reasonForLeave:[''],
      availibilityOnPhone: [Availibilty.Yes],
      availibilityInCity:[Availibilty.Yes],
      startDateAttendanceOption:[LeaveAttendanceOption.FullDay],
      endDateAttendanceOption:[LeaveAttendanceOption.FullDay],
      isAdhocLeave:[''],
      adhocLeaveStatus:['']
    });
  }
  isAdhocLeaveVisible: boolean = false;
  isAdhocLeaveChecked: boolean = false; 

  toggleAdhocLeave() {
    this.isAdhocLeaveVisible = !this.isAdhocLeaveVisible;
    this.isAdhocLeaveChecked = !this.isAdhocLeaveChecked; 
    console.log(this.isAdhocLeaveChecked);

  }
  showLeaveRequestSuccess:boolean = false;
  leaveRequestSuccessMessage: string='';
  showLeaveRequestError: boolean = false;
  leaveRequetErrorMessage: string = '';
  isDateDurationValid = true;
  isEndDateValid = true;
  isSaveButtonClicked = false;




  calculateDurationAndReturnDate() {
    const startDate = this.addLeaveRequestForm.get('leaveStartDate')?.value;
    const endDate = this.addLeaveRequestForm.get('leaveEndDate')?.value;
    const formattedstartDate = this.datePipe.transform(startDate ?? '', 'yyyy-MM-dd');
    console.log(formattedstartDate)
    const formattedendDate = this.datePipe.transform(endDate ?? '', 'yyyy-MM-dd');
    console.log(formattedendDate);
    const StartDateOPtion=this.addLeaveRequestForm.get('startDateAttendanceOption')?.value;
    const EndDateOPtion = this.addLeaveRequestForm.get('endDateAttendanceOption')?.value;

    if(StartDateOPtion === 0 ||  EndDateOPtion === 2 || StartDateOPtion === 2 || EndDateOPtion === 0)
    {
      if(StartDateOPtion != EndDateOPtion || formattedstartDate != formattedendDate)
      {
     
        this.showLeaveRequestError = true;
        this.isEndDateValid = false;

        this.leaveRequetErrorMessage = 'Please Select Correct Date Duration';
        setTimeout(()=>
        {
          this.showLeaveRequestError = false;
        },2000)
      }
      else if(StartDateOPtion === EndDateOPtion && formattedstartDate === formattedendDate)
      {
        this.isEndDateValid = true; 

        this.addLeaveRequestForm
        .get('duartion')!
        .setValue('0.5');
        
      }
      else{
        this.isEndDateValid = true; 


        this.callDurationApi()
      }

    }

   else if(StartDateOPtion != 0 || EndDateOPtion != 0 || StartDateOPtion != 2 || EndDateOPtion !=2)
    {
      if (formattedstartDate && formattedendDate && formattedendDate < formattedstartDate)
      {
        this.showLeaveRequestError = true;
        this.isEndDateValid = false; 
        this.leaveRequetErrorMessage = 'EndDate Must Be Greater Than StartDate';
  
        setTimeout(()=>
        {
          this.showLeaveRequestError = false;
        },2000)
        return;
      } 
      else
      {
        this.isEndDateValid = true; 

        this.showLeaveRequestError = false;
        this.callDurationApi()
      }
    }

  }

  callDurationApi()
  {
    const employeeId = localStorage.getItem('employeeId');
    const startDate = this.addLeaveRequestForm.get('leaveStartDate')?.value;
    const endDate = this.addLeaveRequestForm.get('leaveEndDate')?.value;
    const formattedstartDate = this.datePipe.transform(startDate ?? '', 'yyyy-MM-dd');
    console.log(formattedstartDate)
    const formattedendDate = this.datePipe.transform(endDate ?? '', 'yyyy-MM-dd');
    console.log(formattedendDate);
    if(employeeId)
    {
      const request: GetEmployeeDetailsViewModelRequest = {
        EmployeeId: +employeeId,
        StartDate:formattedstartDate,
        EndDate:formattedendDate
      };   
      this.leaverequest.getLeaveRequestInsertDetails(request).subscribe({
        next: (response:any)=>
        {
         console.log(response);
         this.loadData();

         
        }
      })
     }
  }
  onSaveButtonClick(): void 
  {
    console.log(this.isEndDateValid);
    if (!this.isEndDateValid) {
      
      this.showLeaveRequestError = true;
      this.leaveRequetErrorMessage = 'Please check all the fields.';
      
      setTimeout(() => {
        this.showLeaveRequestError = false;
      }, 2000);
      return;
    }
    const employeeId = localStorage.getItem('employeeId'); 
    if (employeeId) {
      const formValues = this.addLeaveRequestForm.value;
      const reasonForLeave = formValues.reasonForLeave;
      if(reasonForLeave === "")
      {
        this.showLeaveRequestError = true;
        this.leaveRequetErrorMessage = 'You need to mention the reason for leave';
  
        setTimeout(()=>
        {
          this.showLeaveRequestError = false;
        },2000)
        return;
      }
      
      const leaveStartDate = formValues.leaveStartDate;
      const leaveEndDate = formValues.leaveEndDate;
     
      const isAdhocLeaveChecked = this.isAdhocLeaveChecked;
      formValues.isAdhocLeave = isAdhocLeaveChecked;
      formValues.adhocLeaveStatus = isAdhocLeaveChecked ? formValues.adhocLeaveStatus : null;

      if (this.reportingPersonId !== undefined)
      {
        formValues.reportingPersonId = this.reportingPersonId;
      }
  
      formValues.employeeId = +employeeId; 
      const request :insertLeaveRequest= {
        EmployeeId: formValues.employeeId,
        ReportingPersonId: formValues.reportingPersonId,
        ReasonForLeave: reasonForLeave,
        LeaveStartDate: leaveStartDate,
        LeaveEndDate: leaveEndDate,
        StartDateAttendanceOption: formValues.startDateAttendanceOption,
        EndDateAttendanceOption: formValues.endDateAttendanceOption,
        IsAdhocLeave: formValues.isAdhocLeave,
        AdhocLeaveStatus: formValues.adhocLeaveStatus,
        PhoneNumber:formValues.phoneNumber,
        AlternatePhoneNumber: formValues.alternatePhoneNumber,
        AvailibiltyOnPhone: Boolean(formValues.availibilityOnPhone),
        AvailibiltyInCity: Boolean(formValues.availibilityInCity),
      };
      
      this.leaverequest.insertLeaveRequest(request).subscribe({
        next:(response:any)=>
        {
          console.log("LeaveRequestSuccefull Response",response);
          const responseMessage=response;
          this.successMessageService.setSuccessMessage(responseMessage);
          this.router.navigate(['/leave-request/view-leaveRequest']);
         
          // this.router.navigate(['/leave-request/view-leaveRequest'],
          // {queryParams: { leaveRequestAdded: 'true' }}
          // );

         
        },
        error:(error:any)=>
        {
          const snackBarConfig: MatSnackBarConfig = {
            duration: 3000,
            verticalPosition: 'top', 
          };
          this._snackbar.open('Cant Add WorkLog...Please try after sometime', 'Close', snackBarConfig);
          this.router.navigate(['/leave-request/view-leaveRequest']);
          setTimeout(() => {
            this.dialog.closeAll();
          }, 3000); 
        }

      })

    }
  }

  getStartDateOption(event: MatSelectChange, fiedType:string) {
    const selectedValue = event.value;
    if(fiedType === 'start' || fiedType === 'end')
{
      this.calculateDurationAndReturnDate();
  
}
}
CancelLeaveRequest()
{
  this.router.navigate(['/leave-request/view-leaveRequest']);
}
}



