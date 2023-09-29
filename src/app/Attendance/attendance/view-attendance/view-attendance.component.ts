import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AttendanceService } from 'src/app/common/services/attendance.service';
import { DiaplayHeaderService } from 'src/app/common/services/displayheader.service';
import { SharedSuccessServiceService } from 'src/app/common/services/shared-success-service.service';
import { Attendance, AttendanceOption, fillAttendance, getAttendanceRequest, holiDay } from 'src/app/models/Attendance';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.css']
})
export class ViewAttendanceComponent implements OnInit{
  selectedItemName: string | null = null;
  showAttendanceSuccess: boolean = false;
  attendanceSuccessMessage: string = '';
  allmonths = [
    { name: 'January', key: 1 },
    { name: 'February', key: 2 },
    { name: 'March', key: 3 },
    { name: 'April', key: 4 },
    { name: 'May', key: 5 },
    { name: 'June', key: 6 },
    { name: 'July', key: 7 },
    { name: 'August', key: 8 },
    { name: 'September', key: 9 },
    { name: 'October', key: 10 },
    { name: 'November', key: 11 },
    { name: 'December', key: 12 }
  ]
  currentMonth = this.allmonths[new Date().getMonth()];
  currentYear = new Date().getFullYear();
  currentDate = new Date();
  attendance: Attendance[] = [];
  attendanceTitle = 'Attendance';
  attendanceApproved = false;
  AttendanceOption: typeof AttendanceOption = AttendanceOption;
  holidayList: holiDay[] = [];
  todaysAttendance = "";
  totalPresent = 0;
  totalAbsent = 0;

  // options = {
  //   autoClose: true,
  //   keepAfterRouteChange: false
  // };

  searchAttendanceForm = this.formBuilder.group({
     month: [this.currentMonth.key],
     year: [this.currentYear]
   });

  ngOnInit(): void {
    this.searchAttendance();
    this.attendanceTitle = this.currentMonth.name + ' - ' + this.currentYear;
    this.displayHeader.selectedItem$.subscribe((itemName) => {
      this.selectedItemName = itemName;
      this.resetAttendance();
    }); 
  }
  constructor(private displayHeader:DiaplayHeaderService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private successMessageService:SharedSuccessServiceService,
    private formBuilder: FormBuilder,
    private service :AttendanceService)
  {

  }


  searchAttendance() {
    if (this.searchAttendanceForm.value.month != null && this.searchAttendanceForm.value.year != null) {
      this.attendanceTitle = this.allmonths[(this.searchAttendanceForm.value.month) - 1].name + ' - ' + (this.searchAttendanceForm.value.year ?? this.currentYear);
    }
    console.log(this.searchAttendanceForm.value.month)
    console.log(this.searchAttendanceForm.value.year)
    var id = localStorage.getItem('employeeId');
    if (id != null) {
      var request: getAttendanceRequest = {
        employeeId: id,
        month: this.searchAttendanceForm.value.month ?? null,
        year: this.searchAttendanceForm.value.year ?? null
      }
      console.log("attendance",request);
      
      this.service.getAttendance(request).subscribe({
        next: (reponse) => {
          this.totalPresent = 0;
          this.totalAbsent = 0;
          this.attendance = reponse.responce;
          for (let index = 0; index < this.attendance.length; index++) {
            let element = this.attendance[index];
            if (element.currentDate != null) {
              let currentDate = new Date();
              let elementDate = new Date(element.currentDate);
              if (elementDate.getDate() === currentDate.getDate() && elementDate.getMonth() === currentDate.getMonth() && elementDate.getFullYear() === currentDate.getFullYear()) {
                this.todaysAttendance = AttendanceOption[(element.attendanceOption ?? 4) - 1];
                this.attendanceApproved = element.isApproved ?? false;
                // console.log(this.todaysAttendance);
              }
              if (element.attendanceOption == 1) {
                this.totalPresent++;
              } else if (element.attendanceOption == 2) {
                this.totalAbsent++;
              }
            }
          }
        },
        error: (error) => {
          console.log("Error getting attendance: ", error);
        }
      });
      this.service.getHoliday().subscribe({
        next: (response) => {
          this.holidayList = response.responce;
          // console.log(this.holidayList);
        },
        error: (error) => {
          console.log("Error getting holidayList: ", error);
        }
      });
    }
  }

  resetAttendance() {
    this.searchAttendanceForm.patchValue({ month: this.currentMonth.key, year: this.currentYear });
  }

  updateAttendance(option: number) {
    this.todaysAttendance = AttendanceOption[option - 1];
  }

  addAttendance() {
  
    var attendance = 0;
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      if (this.todaysAttendance == "P") {
        attendance = 3;
      }
      else if (this.todaysAttendance == "A") {
        attendance = 2;
      }
      else if (this.todaysAttendance == "H") {
        attendance = 1;
      }
      if (attendance != 0) {
        var request: fillAttendance = {
          employeeId: employeeId,
          attendanceOption: attendance
        }
        this.service.addAttendance(request).subscribe({
          next: (response) => {
            const successMessage = response.responce
            //  alert(response.responce);
            this.successMessageService.setSuccessMessage(successMessage);
           this.successMessageService.getSuccessMessage().subscribe((message)=>
           {
            if(message === 'New entry added successfully.')
            {
              this.showAttendanceSuccess = true;
              this.attendanceSuccessMessage = "Attendance Added Successfully";
              setTimeout(() => {
                this.showAttendanceSuccess = false;
              }, 3000);
              this.resetAttendance();
              this.searchAttendance();
            }
            if(message === 'Existing entry updated successfully.')
            {
              this.showAttendanceSuccess = true;
              this.attendanceSuccessMessage = "Existing Attendance Updtaed Successfully";
              setTimeout(() => {
                this.showAttendanceSuccess = false;
              }, 3000);
              this.resetAttendance();
              this.searchAttendance();
            }
           })
            // console.log(response);
          },
          error: (error) => {
            console.log("Error getting attendance: ", error);
          }
        });
      }
    }
  }

  isholyday(date: Date | null): boolean {
    if (date !== null) {
      const attendanceDate = new Date(date);
      const formattedDate = attendanceDate.toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' });
      for (let index = 0; index < this.holidayList.length; index++) {
        let element = new Date(this.holidayList[index].value).toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' });
        if (element === formattedDate) {
          return true;
        }
      }
      // console.log(formattedDate);
      // return Object.values(holidayList).includes(formattedDate); <= for enum
    }
    return false;
  }
}
