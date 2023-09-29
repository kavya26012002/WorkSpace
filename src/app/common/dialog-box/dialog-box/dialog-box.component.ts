import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UpdateWorkLogHistory } from 'src/app/models/ProductBacklogWorkItem';
import { GetAddWorkLog } from 'src/app/models/userLogin';
import { ProductBacklogWorkItemService } from '../../services/product-backlog-work-item.service';
import { SharedSuccessServiceService } from '../../services/shared-success-service.service';
import { UserServiceService } from '../../services/user-service.service';

interface Minutes {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css'],
})
export class DialogBoxComponent implements OnInit {
  showAdditionalFields: boolean = true;
  isHistory = '';

  maxHours = 20;
  workItemName!: string;
  workDoneBy!: string;
  workDoneOn!: any;
  originalEst!: any;
  remainingHours!: any;
  formattedWorkDoneOn!: any;
  description!:any;

  progressValue: number = 0;
  showWorkLogError: boolean = false;
  showWorkLogSuccess: boolean = false;
  workLogErrorMessage: string = '';
  workLogSuccessMessage: string = '';
  routerlink: any = '';
  // showAdditionalFields = new BehaviorSubject<boolean>(true);

  // HoursDropdown
  limitHours(event: any) {
    const input = event.target;
    const value = parseInt(input.value, 10);

    if (isNaN(value) || value < 0) {
      input.value = '';
    } else if (value > this.maxHours) {
      input.value = this.maxHours.toString();
    }
  }

  //updtaeHoursDropdown
  limitUpdateHours(event: any) {
    const input = event.target;
    const value = parseInt(input.value, 10);

    if (isNaN(value) || value < 0) {
      input.value = '';
    } else if (value > this.maxHours) {
      input.value = this.maxHours.toString();
    }
  }

  // MinutesDropdown
  minutes: Minutes[] = [
    { value: '0', viewValue: '0' },
    { value: '15', viewValue: '15' },
    { value: '30', viewValue: '30' },
    { value: '45', viewValue: '45' },
  ];
  selectedMinutes = this.minutes[0].value;
  selectMinutes(event: Event) {
    this.selectedMinutes = (event.target as HTMLSelectElement).value;
  }

  selectdropdownMinutes(event: Event) {
    this.selectedMinutes = (event.target as HTMLSelectElement).value;
  }
  //updateMinutesDropDown
  minutesupdate: Minutes[] = [
    { value: '0', viewValue: '0' },
    { value: '15', viewValue: '15' },
    { value: '30', viewValue: '30' },
    { value: '45', viewValue: '45' },
  ];
  selectedMinutesUpdate = this.minutes[0].value;
  selectMinutesUpdate(event: Event) {
    this.selectedMinutesUpdate = (event.target as HTMLSelectElement).value;
  }

  selectdropdownMinutesUpdate(event: Event) {
    this.selectedMinutesUpdate = (event.target as HTMLSelectElement).value;
  }

  dialogboxform: FormGroup = new FormGroup({});
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    private _snackbar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder,
    private userservice: UserServiceService,
    private successMessageService: SharedSuccessServiceService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private workitems: ProductBacklogWorkItemService,


    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.workItemName = data.workItemName;
    this.workDoneBy = data.workDoneBy;

    this.originalEst = data.originalEst;
    // this.remainingHours = data.remainingHours;
    this.formattedWorkDoneOn = data.formattedWorkDoneOn;
    this.description = data.description
  }
  

  ngOnInit(): void {
    this.successMessageService.getServceRouter().subscribe((response) => {
      this.routerlink = response as String;
    });

console.log("gfjdnfjd:",this.description);
    this.dialogboxform = this.formBuilder.group({
      workItemName: [this.workItemName],
      workDoneBy: [this.workDoneBy],
      originalEst: [this.originalEst],
      remainingHours: [this.remainingHours],
      formattedWorkDoneOn: [this.formattedWorkDoneOn],
      description: [this.description],
      workTime: [''],
      selectedMinutes: [''],
      inputValue: 0,
      showFiled: new FormControl<boolean>(true),
      workTime2: [{ value: 0, disabled: true }], // Set disabled to true by default
      selectedMinutes2: [{ value: '', disabled: true }], // Set disabled to true by default
    });
    this.updateProgress();
  }

  updateProgress() {
    const hours = +this.dialogboxform.get('workTime')?.value || 0;
    const minutes = +this.selectedMinutes || 0;
    const totalWorkTime = hours + minutes / 60;

    if (totalWorkTime >= this.originalEst) {
      this.progressValue = 100;
    } else if (totalWorkTime === 0) {
      this.progressValue = 0;
    } else if (hours === 0 && minutes === 0) {
      this.progressValue = 0;
      console.log(this.progressValue);
    } else {
      const percentage = (totalWorkTime / this.originalEst) * 100;
      this.progressValue = Math.min(percentage, 100);
      this.progressValue = Math.floor(this.progressValue);
    }
    console.log(this.progressValue);
  }
  updateReaminingProgress() {
    const hours = +this.dialogboxform.get('workTime2')?.value || 0;
    const minutes = +this.selectedMinutesUpdate || 0;
    const totalWorkTime = hours + minutes / 60;

    if (totalWorkTime >= this.originalEst) {
      this.progressValue = 100;
    } else if (totalWorkTime === 0) {
      this.progressValue = 0;
    } else if (hours === 0 && minutes === 0) {
      this.progressValue = 0;
      console.log(this.progressValue);
    } else {
      const percentage = (totalWorkTime / this.originalEst) * 100;
      this.progressValue = Math.min(percentage, 100);
      this.progressValue = Math.floor(this.progressValue);
    }
    console.log(this.progressValue);
  }
  // initialRemainingHours: number = this.data.remainingHours;
  initialRemainingHours: number = 0;
  updatedRemainingHours: number = 0;
  showUpdatedRemainingHours: boolean = false;
  showUpdatedWorkDone: boolean = false;
  showUpdatedRemainingWorkDone: boolean = false;
  updatedTotalWorkDone: number = 0;
  showUpdtaedRemainingHours: boolean = false;

  updateRemainingHours(event: any) {
    const hours = +this.dialogboxform.get('workTime')?.value || 0;
    const minutes = +this.selectedMinutes || 0;
    const totalWorkTime = hours + minutes / 60;
    if (totalWorkTime >= this.originalEst) {
      this.updatedRemainingHours = 0.0;
    } else {
      this.updatedRemainingHours = this.originalEst - totalWorkTime;
    }
  }
  updateupdateRemainingHours(event: any) {
    const hours = +this.dialogboxform.get('workTime2')?.value || 0;
    const minutes = +this.selectedMinutesUpdate || 0;
    const totalWorkTime = hours + minutes / 60;
    if (totalWorkTime >= this.originalEst) {
      this.updatedRemainingHours = 0.0;
    } else {
      this.updatedRemainingHours = this.originalEst - totalWorkTime;
    }
  }
  switchToUpdatedRemainingHours() {
    this.showUpdatedRemainingHours = true;
  }
  switchToUpdatedupadteRemainingHours() {
    this.showUpdtaedRemainingHours = true;
  }
  updateTotalWork(event: any) {
    const hours = +this.dialogboxform.get('workTime')?.value || 0;
    const minutes = +this.selectedMinutes || 0;
    const totalWorkTime = hours + minutes / 60;
    this.updatedTotalWorkDone = totalWorkTime;
  }
  updateReamingTotalWork(event: any) {
    const hours = +this.dialogboxform.get('workTime2')?.value || 0;
    const minutes = +this.selectedMinutesUpdate || 0;
    const totalWorkTime = hours + minutes / 60;
    this.updatedTotalWorkDone = totalWorkTime;
  }
  switchToUpdateTotalWorkDone() {
    this.showUpdatedWorkDone = true;
  }
  switchToUpdateupdatedTotalWorkDone() {
    this.showUpdatedRemainingWorkDone = true;
  }

  public switchCase: boolean = false;
  public switchdropdownCase: boolean = false;
  public update = false;

  toggleButton() {
    this.update = !this.update;
    if (this.update) {
      this.dialogboxform.get('workTime2')?.enable();
      this.dialogboxform.get('selectedMinutes2')?.enable();
    } else {
      this.dialogboxform.get('workTime2')?.disable();
      this.dialogboxform.get('selectedMinutes2')?.disable();
    }
  }
  closeDialog() {
    this.dialogRef.close(false);
  }
  AddWorkLog() {
    if (!this.dialogboxform.valid) {
      this.showWorkLogError = true;
      this.workLogErrorMessage = 'Please provide valid data in the form.';
      return;
    }
    this.showWorkLogError = false;

    const employeeId = localStorage.getItem('employeeId');
    if (employeeId === null) {
      console.log('Employee ID is not available');
      return;
    }

    const projectWorkId = this.getProjectWorkIdFromTitle(
      this.dialogboxform.value.workItemName
    );

    const formattedWorkDoneOn = this.dialogboxform.get(
      'formattedWorkDoneOn'
    )?.value;

    const formattedStartDate = this.datePipe.transform(
      formattedWorkDoneOn ?? '',
      'yyyy-MM-dd'
    );
    console.log(formattedStartDate);

    const hours = +this.dialogboxform.get('workTime')?.value || 0;
    const minutes = +this.selectedMinutes || 0;
    const totalWorkTime = hours + minutes / 60;

    const description = this.dialogboxform.value.description;
    if (hours === 0 && minutes === 0) {
      this.showWorkLogError = true;
      this.workLogErrorMessage = 'Please enter a valid work time.';

      setTimeout(() => {
        this.showWorkLogError = false;
      }, 3000);
      return;
    }

    const worklog: GetAddWorkLog = {
      employeeId: +employeeId,
      projectWorkId: +projectWorkId,
      workDoneOn: formattedStartDate,
      workTime: totalWorkTime,
      // remaining:this.updatedRemainingHours,
      description: description,
    };
    console.log('Add WorkLog', worklog);

    this.userservice.getAddWorkLog(worklog).subscribe({
      next: (response: any) => {
        console.log(response);
        this.dialogRef.close(true);
        const responseMessage = response;
        this.successMessageService.setSuccessMessage(responseMessage);

        this.router.navigate([this.routerlink]);
        console.log('AfterNavigationrouterlink', this.routerlink);

     
      },
      error: (error: any) => {
        const snackBarConfig: MatSnackBarConfig = {
          duration: 3000,
          verticalPosition: 'top',
        };
        this._snackbar.open(
          'Cant Add WorkLog...Please try after sometime',
          'Close',
          snackBarConfig
        );
        this.router.navigate(['/work-item/view-workItem']);
        setTimeout(() => {
          this.dialogRef.close(false);
        }, 3000);
      },
    });
  }
  progressClass(progressValue: number): any {
    if (progressValue > 0) {
      return 'ProgressGreaterZero';
    } else {
      return 'ProgressZero';
    }
  }

  getProjectWorkIdFromTitle(title: string): number {
    const parts = title.split(':');
    if (parts.length > 1) {
      return +parts[0].trim();
    }
    return 0;
  }
  CloseWorkLog() {
    this.dialogRef.close(false);
  }
  UpdateWorkLogHistory()
  {
    var workLogHistoryId = this.data.workLogHistoryId ?? '';
    console.log(workLogHistoryId);
    if (!this.dialogboxform.valid) {
      this.showWorkLogError = true;
      this.workLogErrorMessage = 'Please provide valid data in the form.';
      return;
    }
    this.showWorkLogError = false;

    const employeeId = localStorage.getItem('employeeId');
    if (employeeId === null) {
      console.log('Employee ID is not available');
      return;
    }

    const projectWorkId = this.getProjectWorkIdFromTitle(
      this.dialogboxform.value.workItemName
    );

    const formattedWorkDoneOn = this.dialogboxform.get(
      'formattedWorkDoneOn'
    )?.value;

    const formattedStartDate = this.datePipe.transform(
      formattedWorkDoneOn ?? '',
      'yyyy-MM-dd'
    );
    console.log(formattedStartDate);

    const hours = +this.dialogboxform.get('workTime')?.value || 0;
    const minutes = +this.selectedMinutes || 0;
    const totalWorkTime = hours + minutes / 60;

    const description = this.dialogboxform.value.description;
    if (hours === 0 && minutes === 0) {
      this.showWorkLogError = true;
      this.workLogErrorMessage = 'Please enter a valid work time.';

      setTimeout(() => {
        this.showWorkLogError = false;
      }, 3000);
      return;
    }

    const worklog: UpdateWorkLogHistory = {
      WorkLogHistoryId:+workLogHistoryId,
      
      ProjectWorkID: +projectWorkId,
      WorkDoneOn: formattedStartDate,
      WorkTime: totalWorkTime,
      Description: description,
    };
  

    this.workitems.UpdateWorkLogHistory(worklog).subscribe({
      next: (response: any) => {
        console.log(response);
        this.dialogRef.close(true);
        const responseMessage = response;
        this.successMessageService.setSuccessMessage(responseMessage);
        this.router.navigate([this.routerlink]);
        console.log('AfterNavigationrouterlink', this.routerlink);

     
      },
      error: (error: any) => {
        const snackBarConfig: MatSnackBarConfig = {
          duration: 3000,
          verticalPosition: 'top',
        };
        this._snackbar.open(
          'Cant Add WorkLog...Please try after sometime',
          'Close',
          snackBarConfig
        );
        this.router.navigate(['/work-item/view-workItem']);
        setTimeout(() => {
          this.dialogRef.close(false);
        }, 3000);
      },
    });
  }
}
