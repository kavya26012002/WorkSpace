import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { DiaplayHeaderService } from 'src/app/common/services/displayheader.service';
import { TimesheetService } from 'src/app/common/services/timesheet.service';
import {
  GetTimeSheetDetailsViewModelRequest,
  GetTimeSheetResponse,
  TimeSheetHoverViewModelRequest,
} from 'src/app/models/timeSheet';

@Component({
  selector: 'app-view-time-sheet',
  templateUrl: './view-time-sheet.component.html',
  styleUrls: ['./view-time-sheet.component.css'],
})
export class ViewTimeSheetComponent implements OnInit {
  currentMonth: Date = new Date();
  currentYear: Date = new Date();
  datesForCurrentMonth: string[] = [];
  dayNamesForCurrentMonth: string[] = [];
  columnNames: string[] = ['workItem', 'P', 'Sigma'];
  uniqueProjectNames: any[] = [];
  showContent: boolean[] = [];
  projects: GetTimeSheetResponse[] = [];
  displayedData: any[] = [];
  halfdayleavedate: any[] = [];
  fulldayleavedate: any[] = [];
  publicholidaydate: any[] = [];
  DailyWorkLog: any[] = [];
  DailyTimeLog: any[] = [];
  public gridData: any[] = [];
  public i: number = 0;
  projectVisibility: boolean[] = [];
  tooltipProjectTitle: string = '';
  tooltipResponseData: any = {
    title: '',
    startDate: '',
    endDate: '',
    originalEstimate: '',
    spentTime: '',
    remaining: '',
  };
  tooltipdata: any;
  sanitinzedHtml!: SafeHtml;

  constructor(
    private timesheetrequest: TimesheetService,
    private displayHeader: DiaplayHeaderService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.generateColumnNamesAndDates();
    this.generateDayNames();
    this.getAttendanceList();
    this.calculatedailyWorkLogHours();
    this.calculatedailyTimeLogHours();

    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      const request: GetTimeSheetDetailsViewModelRequest = {
        EmployeeId: +employeeId,
        Month: null,
        year: null,
      };
      this.timesheetrequest.getTimeSheetData(request).subscribe({
        next: (response: any) => {
          this.projects = response;

          this.uniqueProjectNames = this.projects
            .map((project) => project.projectName || '')
            .filter((value, index, self) => self.indexOf(value) === index);
          this.filterGridData();
        },
      });
    }
  }

  calculatedailyWorkLogHours() {
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      const request: GetTimeSheetDetailsViewModelRequest = {
        EmployeeId: +employeeId,
        Month: null,
        year: null,
      };
      this.timesheetrequest.getDailyworkHours(request).subscribe({
        next: (response: any) => {
          this.DailyWorkLog = response.map((item: any) => ({
            workDoneOn: item.workDoneOn,
            workTime: item.workTime,
          }));
          this.WeekendWork();
        },
      });
    }
  }
  calculatedailyTimeLogHours() {
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      const request: GetTimeSheetDetailsViewModelRequest = {
        EmployeeId: +employeeId,
        Month: null,
        year: null,
      };
      this.timesheetrequest.getDailyTimeLogHours(request).subscribe({
        next: (response: any) => {
          this.DailyTimeLog = response.map((item: any) => ({
            logDate: item.logDate,
            timeLog: item.timeLog,
          }));
        },
      });
    }
  }
  calculateTotalWorkLog(projectName: string): number {
    const projectItems = this.getProjectItems(projectName);

    return projectItems.reduce(
      (sum, project) => sum + parseFloat(project.totalWorkLog),
      0
    );
  }

  getProjectItems(projectName: string): GetTimeSheetResponse[] {
    return this.projects.filter(
      (project) => project.projectName === projectName
    );
  }
  filterGridData(): void {
    this.gridData = this.uniqueProjectNames.map((projectName) => ({
      projectName,
      data: this.getProjectItems(projectName),
    }));
  }

  toggleContent(index: number) {
    this.showContent[index] = !this.showContent[index];
  }

  getAttendanceList() {
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      const request: GetTimeSheetDetailsViewModelRequest = {
        EmployeeId: +employeeId,
        Month: null,
        year: null,
      };
      this.timesheetrequest.getAttendanceandLeavedates(request).subscribe({
        next: (response: any) => {
          this.fulldayleavedate = [];
          for (const item of response.timesheetAttendanceTopDetailsViewModelResponse) {
            this.fulldayleavedate.push(item.fullDayLeaveDates);
          }
          this.halfdayleavedate = [];
          for (const item of response.timesheetAttendanceBottomDetailsViewModelResponse) {
            this.halfdayleavedate.push(item.halfDayLeaveDates);
          }
          this.publicholidaydate = [];
          for (const item of response.timesheetAttendanceHolidayListViewModelResponse) {
            this.publicholidaydate.push(item.holidayDate);
          }
        },
      });
    }
  }
  generateColumnNamesAndDates(): void {
    const currentDate = this.currentMonth;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.datesForCurrentMonth = Array.from(
      { length: daysInMonth },
      (_, i) => `${i + 1}`
    );
  }
  generateDayNames(): void {
    const currentDate = this.currentMonth;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    this.dayNamesForCurrentMonth = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayName = (this.datePipe.transform(date, 'EEEE') ?? '').charAt(0);
      this.dayNamesForCurrentMonth.push(dayName);
    }
  }
  tabledata: any[] = [];
  generateTableData(): { value: string; name: string }[] {
    const tableData: { value: string; name: string }[] = [];

    for (let i = 0; i < this.datesForCurrentMonth.length; i++) {
      const dataValue = this.datesForCurrentMonth[i];
      const nameValue = this.dayNamesForCurrentMonth[i];
      tableData.push({ value: dataValue, name: nameValue });
    }
    this.tabledata = tableData;
    return tableData;
  }

  selectedItemName: string | null = null;
  prevMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateColumnNamesAndDates();
    this.generateDayNames();

    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      const request: GetTimeSheetDetailsViewModelRequest = {
        EmployeeId: +employeeId,
        Month: this.currentMonth.getMonth() + 1,
        year: this.currentMonth.getFullYear(),
      };
      this.timesheetrequest.getTimeSheetData(request).subscribe({
        next: (response: any) => {
          this.projects = response;

          this.uniqueProjectNames = this.projects
            .map((project) => project.projectName || '')
            .filter((value, index, self) => self.indexOf(value) === index);
          this.filterGridData();
        },
      });
      this.timesheetrequest.getDailyworkHours(request).subscribe({
        next: (response: any) => {
          this.DailyWorkLog = response.map((item: any) => ({
            workDoneOn: item.workDoneOn,
            workTime: item.workTime,
          }));
          this.WeekendWork();
        },
      });
      this.timesheetrequest.getDailyTimeLogHours(request).subscribe({
        next: (response: any) => {
          this.DailyTimeLog = response.map((item: any) => ({
            logDate: item.logDate,
            timeLog: item.timeLog,
          }));
        },
      });
      this.timesheetrequest.getAttendanceandLeavedates(request).subscribe({
        next: (response: any) => {
          this.fulldayleavedate = [];
          for (const item of response.timesheetAttendanceTopDetailsViewModelResponse) {
            this.fulldayleavedate.push(item.fullDayLeaveDates);
          }
          this.halfdayleavedate = [];
          for (const item of response.timesheetAttendanceBottomDetailsViewModelResponse) {
            this.halfdayleavedate.push(item.halfDayLeaveDates);
          }
          this.publicholidaydate = [];
          for (const item of response.timesheetAttendanceHolidayListViewModelResponse) {
            this.publicholidaydate.push(item.holidayDate);
          }
        },
      });
    
    }
  }
  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateColumnNamesAndDates();
    this.generateDayNames();
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      const request: GetTimeSheetDetailsViewModelRequest = {
        EmployeeId: +employeeId,
        Month: this.currentMonth.getMonth() + 1,
        year: this.currentMonth.getFullYear(),
      };

      this.timesheetrequest.getTimeSheetData(request).subscribe({
        next: (response: any) => {
          this.projects = response;

          this.uniqueProjectNames = this.projects
            .map((project) => project.projectName || '')
            .filter((value, index, self) => self.indexOf(value) === index);
          this.filterGridData();
        },
      });
      this.timesheetrequest.getDailyworkHours(request).subscribe({
        next: (response: any) => {
          this.DailyWorkLog = response.map((item: any) => ({
            workDoneOn: item.workDoneOn,
            workTime: item.workTime,
          }));
          this.WeekendWork();
        },
      });
      this.timesheetrequest.getDailyTimeLogHours(request).subscribe({
        next: (response: any) => {
          this.DailyTimeLog = response.map((item: any) => ({
            logDate: item.logDate,
            timeLog: item.timeLog,
          }));
        },
      });
      this.timesheetrequest.getAttendanceandLeavedates(request).subscribe({
        next: (response: any) => {
          this.fulldayleavedate = [];
          for (const item of response.timesheetAttendanceTopDetailsViewModelResponse) {
            this.fulldayleavedate.push(item.fullDayLeaveDates);
          }
          this.halfdayleavedate = [];
          for (const item of response.timesheetAttendanceBottomDetailsViewModelResponse) {
            this.halfdayleavedate.push(item.halfDayLeaveDates);
          }
          this.publicholidaydate = [];
          for (const item of response.timesheetAttendanceHolidayListViewModelResponse) {
            this.publicholidaydate.push(item.holidayDate);
          }
        },
      });
     
    }
  }

  private getNowUTC(datevar: Date) {
    return new Date(datevar.getTime() - datevar.getTimezoneOffset() * 60000);
  }

  getValueForDate(value: any, title: string): any {
    var tempMonth = this.currentMonth.getMonth();
    var tempYear = this.currentMonth.getFullYear();
    for (let index = 0; index < this.projects.length; index++) {
      let element = this.projects[index];
      if (element.projectTitle == title) {
        var tempDate = new Date(tempYear, tempMonth, value);
        var tempDateString = this.getNowUTC(tempDate).toISOString();
        var newtempDate = tempDateString.split('T')[0] + 'T00:00:00';
        var worklogValue = this.projects[index].dateValues[newtempDate];
        return worklogValue;
      }
    }
  }
  isToday(dateValue: any): boolean {
    var tempMonth = this.currentMonth.getMonth();
    var tempYear = this.currentMonth.getFullYear();
    var tempDate = new Date(tempYear, tempMonth, dateValue);

    var year = tempDate.getFullYear();
    var month = (tempDate.getMonth() + 1).toString().padStart(2, '0');
    var day = tempDate.getDate().toString().padStart(2, '0');

    var formattedDate = `${year}-${month}-${day}`;

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    return formattedDate === formattedToday;
  }
  isHalfDay(dateValue: any): any {
    var tempMonth = this.currentMonth.getMonth();
    var tempYear = this.currentMonth.getFullYear();
    var tempDate = new Date(tempYear, tempMonth, dateValue);
    var tempDateString = this.getNowUTC(tempDate).toISOString();
    var newtempDate = tempDateString.split('T')[0] + 'T00:00:00';
    return this.halfdayleavedate.includes(newtempDate);
  }
  isFullDay(dateValue: any): boolean {
    var tempMonth = this.currentMonth.getMonth();
    var tempYear = this.currentMonth.getFullYear();
    var tempDate = new Date(tempYear, tempMonth, dateValue);

    var tempDateString = this.getNowUTC(tempDate).toISOString();
    var newtempDate = tempDateString.split('T')[0] + 'T00:00:00';

    return this.fulldayleavedate.includes(newtempDate);
  }
  ispublicHoliday(dateValue: any): boolean {
    var tempMonth = this.currentMonth.getMonth();
    var tempYear = this.currentMonth.getFullYear();
    var tempDate = new Date(tempYear, tempMonth, dateValue);

    var tempDateString = this.getNowUTC(tempDate).toISOString();
    var newtempDate = tempDateString.split('T')[0] + 'T00:00:00';

    return this.publicholidaydate.includes(newtempDate);
  }
  isWeekend(dateValue: any): boolean {
    var tempMonth = this.currentMonth.getMonth();
    var tempYear = this.currentMonth.getFullYear();
    var tempDate = new Date(tempYear, tempMonth, dateValue);

    var dayOfWeek = tempDate.getDay();

    return dayOfWeek === 0 || dayOfWeek === 6;
  }
  frontendate: any;
  generateDailyWorkLog(DateValue: any): any {
    var tempMonth = this.currentMonth.getMonth();
    var tempYear = this.currentMonth.getFullYear();
    var tempDate = new Date(tempYear, tempMonth, DateValue);
    var tempDateString = this.getNowUTC(tempDate).toISOString();
    var newtempDate = tempDateString.split('T')[0] + 'T00:00:00';

    for (const item of this.DailyWorkLog) {
      if (item.workDoneOn === newtempDate) {
        return item.workTime;
      }
    }
    return null;
  }

  tempWorktime = 0;
  weekendWork: { date: Date; workTime: number }[] = [];
  WeekendWork() {
    for (let index = 0; index < this.tabledata.length; index++) {
     
      const element = this.tabledata[index];
      // console.log(element);
      var tempMonth = this.currentMonth.getMonth();
      var tempYear = this.currentMonth.getFullYear();
      var tempDate = new Date(tempYear, tempMonth, element.value);
      var tempDateString = this.getNowUTC(tempDate).toISOString();
      var newtempDate = tempDateString.split('T')[0] + 'T00:00:00';
      let dayOfWeek = tempDate.getDay();
      for (const item of this.DailyWorkLog) {
        if (item.workDoneOn === newtempDate) {
          this.addWeekendWork(tempDate, item.workTime);
        } else if (dayOfWeek === 6) {
          this.addWeekendWork(tempDate, 0);
        }
      }
    }

  }
  addWeekendWork(date: Date, workTime: any) {
    let dayOfWeek = date.getDay();

    if (!(dayOfWeek === 0 || dayOfWeek === 6)) {
      this.tempWorktime += parseFloat(workTime);
    } else if (dayOfWeek === 6) {
      if (this.tempWorktime > 0) {
        this.weekendWork.push({
          date: new Date(date), 
          workTime: this.tempWorktime,
        });
        this.tempWorktime = 0; 
      }
    }
  }

  getWeekendWork(dateDay: any): any {
    for (let index = 0; index < this.weekendWork.length; index++) {
      const element = this.weekendWork[index];
      const tempMonth = this.currentMonth.getMonth();
      const tempYear = this.currentMonth.getFullYear();
      const tempDate = new Date(tempYear, tempMonth, dateDay);
        if (tempDate.getTime() === element.date.getTime()) {
        return element.workTime;
      }
    }
    return null;
  }
  
  generateDailyTimeLog(DateValue: any): any {
    var tempMonth = this.currentMonth.getMonth();
    var tempYear = this.currentMonth.getFullYear();
    var tempDate = new Date(tempYear, tempMonth, DateValue);
    var tempDateString = this.getNowUTC(tempDate).toISOString();
    var newtempDate = tempDateString.split('T')[0] + 'T00:00:00';
    for (const item of this.DailyTimeLog) {
      if (item.logDate === newtempDate) {
        return item.timeLog;
      }
    }
    return null;
  }
  isSaturday(DateValue: any): boolean {
    var tempMonth = this.currentMonth.getMonth();
    var tempYear = this.currentMonth.getFullYear();
    var tempDate = new Date(tempYear, tempMonth, DateValue);
    var dayOfWeek = tempDate.getDay();
    return dayOfWeek === 6;
  }
  onProjectTitleHover(title: string): void {
    const projectid = parseInt(title.split(':')[0], 10);

    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      const request: TimeSheetHoverViewModelRequest = {
        EmployeeId: +employeeId,
        ProjectId: projectid,
      };
      this.timesheetrequest.getHoverTimeSheetDetails(request).subscribe({
        next: (response: any) => {
          console.log("timeshet",response);
          this.tooltipResponseData = {
            title: response[0].title,
            startDate: response[0].startDate,
            endDate: response[0].endDate,
            originalEstimate: response[0].originalEstimate,
            spentTime: response[0].spentTime,
            remaining: response[0].remaining,
          };
        },
      });
    }
  }

  onProjectTitleLeave(): void {}
  ViewPbWorkItem(WorkItemtitle:any):any{
    let splittedtitle = WorkItemtitle.split(':')[0];
    // console.log(splittedtitle);
    this.router.navigate(['/pbWorkItem/view-WorkItem'],
    {queryParams:
    {
      ProjectWorkId:splittedtitle,
    }});

  }
 
}
