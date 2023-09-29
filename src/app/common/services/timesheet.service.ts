import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetTimeSheetDetailsViewModelRequest, TimeSheetHoverViewModelRequest } from 'src/app/models/timeSheet';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  private timesheetDataapi = 'https://localhost:7268/api/TimeSheet/GetSheetDetail';
  private attendanceandleavedatesapi = 'https://localhost:7268/api/TimeSheet/GetTimeSheetAttendanceDetails';
  private dailyWorkLogHours = 'https://localhost:7268/api/TimeSheet/GetTimeSheetDailyTimeLogEmployeeAndDate';
  private dailyTimeLogHours = 'https://localhost:7268/api/TimeSheet/GetTimeSheetDailyTimeLogggEmployeeAndDate';
  private hovertimesheet = 'https://localhost:7268/api/TimeSheet/GetTimeSheetHover';
  constructor(private http:HttpClient) { }

  getTimeSheetData(searchparms:GetTimeSheetDetailsViewModelRequest)
  {
return this.http.post(this.timesheetDataapi,searchparms);
  }
  getAttendanceandLeavedates(searchparms:GetTimeSheetDetailsViewModelRequest)
  {
    return this.http.post(this.attendanceandleavedatesapi,searchparms);

  }
  getDailyworkHours(searchparms:GetTimeSheetDetailsViewModelRequest)
  {
    return this.http.post(this.dailyWorkLogHours,searchparms);
  }
  getDailyTimeLogHours(searchparms:GetTimeSheetDetailsViewModelRequest)
  {
    return this.http.post(this.dailyTimeLogHours,searchparms);
  }
  getHoverTimeSheetDetails(searchparms:TimeSheetHoverViewModelRequest)
  {
    return this.http.post(this.hovertimesheet,searchparms);
  }
}
