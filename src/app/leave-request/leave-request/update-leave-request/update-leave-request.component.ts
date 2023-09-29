import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveRequestService } from 'src/app/common/services/leave-request.service';
import { SharedSuccessServiceService } from 'src/app/common/services/shared-success-service.service';
import { Availibilty, LeaveAttendanceOption } from 'src/app/models/enum';
import { DeleteLeaveRequest, GetEmployeeDetailsViewModelRequest, GetUpdateEmployeeDetail, insertLeaveRequest, UpdateLeaveRequest } from 'src/app/models/leaveRequest';

@Component({
  selector: 'app-update-leave-request',
  templateUrl: './update-leave-request.component.html',
  styleUrls: ['./update-leave-request.component.css']
})
export class UpdateLeaveRequestComponent implements OnInit,AfterViewInit {
  leaveRequestStatus!: string; 

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.leaveRequestStatus = params['LeaveRequestStatus'];      
  });

  



    this.updateLeaveRequestForm = this.formBuilder.group({
      employeeName:[''],
      reportingPersonName:[''],
      reasonForLeave:[''],
      leaveStartDate:[''],
      leaveEndDate:[''],
      startDateAttendanceOption:[''],
      endDateAttendanceOption:[''],
      requestedDate:[''],
      returnDate:[''],
      duartion: [''],
      phoneNumber:[''],
      alternatePhoneNumber:[''],
      availibiltyInCity:[''],
      availibiltyOnPhone:[''],
      isAdhocLeave:[''],
      adhocLeaveStatus:['']

    })
  }
  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      const leaveRequestId = params['LeaveRequestId'];
      this.loadData(leaveRequestId);
    });
  }
  

  LeaveAttendanceOption = LeaveAttendanceOption;
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
  updateLeaveRequestForm: FormGroup = new FormGroup({});
  constructor(
    private dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder,
    private leaverequest: LeaveRequestService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private successMessageService:SharedSuccessServiceService

  ) {
    
  }
  private storedLeaveRequestId: any = ''; 
  private storedLeaveRequestStatus:any = '';

  loadData(leaveRequestId:string) {
    this.storedLeaveRequestId = leaveRequestId;
    const request:GetUpdateEmployeeDetail=
    {
      LeaveRequestId :leaveRequestId
    };
    this.leaverequest.UpdateGetEmployeeDetails(request).subscribe({
      next:(response:any)=>
      {
        const topresponse= response.getUpdateLeaveRequestTopViewModelResponse;
        const bottomresponse = response.getUpdateLeaveRequestBottomViewModelResponse;
       console.log(bottomresponse);
       


          this.updateLeaveRequestForm.controls['employeeName'].setValue(topresponse[0].employeeName);
          this.updateLeaveRequestForm.controls['reportingPersonName'].setValue(topresponse[0].reportingPersonName);
          this.updateLeaveRequestForm.controls['reasonForLeave'].setValue(bottomresponse[0].reasonForLeave);
          const foramttedStartDate = this.datePipe.transform(bottomresponse[0].leaveStartDate,'yyyy-MM-dd');
          const formattedEndDate = this.datePipe.transform(bottomresponse[0].leaveEndDate,'yyyy-MM-dd');
          const formattedRequestedDate = this.datePipe.transform(bottomresponse[0].requestedDate,'yyyy-MM-dd');

          this.updateLeaveRequestForm.controls['leaveStartDate'].setValue(foramttedStartDate);
          this.updateLeaveRequestForm.controls['leaveEndDate'].setValue(formattedEndDate);
          this.updateLeaveRequestForm.controls['requestedDate'].setValue(formattedRequestedDate);
          this.updateLeaveRequestForm.controls['phoneNumber'].setValue(bottomresponse[0].phoneNumber);
          this.updateLeaveRequestForm.controls['alternatePhoneNumber'].setValue(bottomresponse[0].alternatePhoneNumber);
          this.updateLeaveRequestForm.controls['isAdhocLeave'].setValue(bottomresponse[0].isAdhocLeave);
          this.updateLeaveRequestForm.controls['adhocLeaveStatus'].setValue(bottomresponse[0].adhocLeaveStatus);
          const isAdhocLeave = this.updateLeaveRequestForm.get('isAdhocLeave')?.value;

        if (!isAdhocLeave)
        {
        this.updateLeaveRequestForm.get('adhocLeaveStatus')?.setValue(0);
        this.updateLeaveRequestForm.get('adhocLeaveStatus')?.disable();
        }
        else
        {
          this.updateLeaveRequestForm.get('adhocLeaveStatus')?.enable();
          this.isAdhocLeaveVisible = true;
        }   
        const avail=Number(bottomresponse[0].availibiltyOnPhone);
        console.log(avail,typeof avail);
        
   console.log(bottomresponse[0].availibiltyInCity);
   console.log(bottomresponse[0].availibiltyOnPhone);
            this.updateLeaveRequestForm.controls['startDateAttendanceOption'].setValue(+bottomresponse[0].startDateAttendanceOption);
            this.updateLeaveRequestForm.controls['endDateAttendanceOption'].setValue(+bottomresponse[0].endDateAttendanceOption);
            this.updateLeaveRequestForm.controls['availibiltyInCity'].setValue(Number(bottomresponse[0].availibiltyInCity));
            this.updateLeaveRequestForm.controls['availibiltyOnPhone'].setValue(Number(bottomresponse[0].availibiltyOnPhone));
   
          this.Duration();

          console.log(bottomresponse);

      }
    })
  }
  Duration()
  {
    const startDate = this.updateLeaveRequestForm.get('leaveStartDate')?.value;
    const endDate = this.updateLeaveRequestForm.get('leaveEndDate')?.value;
    const formattedstartDate = this.datePipe.transform(startDate ?? '', 'yyyy-MM-dd');
    const formattedendDate = this.datePipe.transform(endDate ?? '', 'yyyy-MM-dd');
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
           

            const firstItem = response.leaverequestinsertlist[0];
           
              
            this.updateLeaveRequestForm
              .get('duartion')!
              .setValue(firstItem.duration);

              const formattedReturnDate = this.datePipe.transform(
                firstItem.returnDate,
                'yyyy-MM-dd'
              );
            this.updateLeaveRequestForm
              .get('returnDate')!
              .setValue(formattedReturnDate);
           
          }
          console.log(response);
        },
      });
    }
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


CancelLeaveRequest()
{

  // this.dialogRef.close(false);

  this.router.navigate(['/leave-request/view-leaveRequest']);
}

calculateDurationAndReturnDate() {
  const startDate = this.updateLeaveRequestForm.get('leaveStartDate')?.value;
  const endDate = this.updateLeaveRequestForm.get('leaveEndDate')?.value;
  const formattedstartDate = this.datePipe.transform(startDate ?? '', 'yyyy-MM-dd');
  console.log(formattedstartDate)
  const formattedendDate = this.datePipe.transform(endDate ?? '', 'yyyy-MM-dd');
  console.log(formattedendDate);
  const StartDateOPtion=this.updateLeaveRequestForm.get('startDateAttendanceOption')?.value;
  const EndDateOPtion = this.updateLeaveRequestForm.get('endDateAttendanceOption')?.value;

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

      this.updateLeaveRequestForm
      .get('duartion')!
      .setValue('0.5');
      
    }
    else{
      this.isEndDateValid = true; 


      this.Duration()
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
      this.Duration()
    }
  }

}
getStartDateOption(event: MatSelectChange, fiedType:string) {
  const selectedValue = event.value;
  if(fiedType === 'start' || fiedType === 'end')
{
    this.calculateDurationAndReturnDate();

}
}
onUpdateButtonClick(): void 
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
    const formValues = this.updateLeaveRequestForm.value;
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
    const formattedStartDate=this.datePipe.transform(leaveStartDate ?? '', 'yyyy-MM-dd');
    console.log(formattedStartDate);
    
    const leaveEndDate = formValues.leaveEndDate;
    const formattedEndDate = this.datePipe.transform(leaveEndDate ?? '', 'yyyy-MM-dd');
    console.log(formattedEndDate);

    const isAdochCkecked = formValues.isAdhocLeave;
    formValues.adhocLeaveStatus = isAdochCkecked ? formValues.adhocLeaveStatus : null;

   
   const request:UpdateLeaveRequest= {
      LeaveRequestId:this.storedLeaveRequestId,
      
      ReasonForLeave: reasonForLeave,
      LeaveStartDate: formattedStartDate,
      LeaveEndDate: formattedEndDate,
      StartDateAttendanceOption: formValues.startDateAttendanceOption,
      EndDateAttendanceOption: formValues.endDateAttendanceOption,
      IsAdhocLeave: formValues.isAdhocLeave,
      AdhocLeaveStatus: formValues.adhocLeaveStatus,
      PhoneNumber:formValues.phoneNumber,
      AlternatePhoneNumber: formValues.alternatePhoneNumber,
      AvailibiltyOnPhone: Boolean(formValues.availibiltyOnPhone),
      AvailibiltyInCity: Boolean(formValues.availibiltyInCity),
    };
    console.log("UpdateLeaveRequest",request )
    this.leaverequest.UpdateLeaveRequest(request).subscribe({
      next:(response:any)=>
      {
        console.log("Leave Response",response);
        const responseMessage = response;
        this.successMessageService.setSuccessMessage(responseMessage);
        this.router.navigate(['/leave-request/view-leaveRequest']);

       
        // this.router.navigate(['/leave-request/view-leaveRequest'],
        // {queryParams: { leaveRequestUpdated: 'true' }}
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
}
