import { UpdateLeaveRequestComponent } from "../leave-request/leave-request/update-leave-request/update-leave-request.component";

export interface GetLeaveRequest
{
  EmployeeId: number;
  LeaveStartDate: any;
  LeaveEndDate:any;
  LeaveRequestStatus:string|null;
  PageNumber:any;
  PageSize:any;
  SortColumn:any;
  SortOrder:any;
}
export interface GetEmployeeDetailsViewModelRequest
{
  EmployeeId: number;
  StartDate:any;
  EndDate:any;
}
export interface insertLeaveRequest{
  EmployeeId:number;
  ReportingPersonId:number;
  ReasonForLeave:string;
  LeaveStartDate:any;
  LeaveEndDate:any;
  StartDateAttendanceOption:any;
  EndDateAttendanceOption:any;
  IsAdhocLeave:any;
  AdhocLeaveStatus:any|null;
  PhoneNumber:number;
  AlternatePhoneNumber:number|null;
  AvailibiltyOnPhone:any|null;
  AvailibiltyInCity:any|null;
 
}
export interface DeleteLeaveRequest{
  EmployeeId:number;
  LeaveRequestId:string;
}
export interface GetUpdateEmployeeDetail
{
  LeaveRequestId:string;
}
export interface UpdateLeaveRequest{
  LeaveRequestId:any;
  ReasonForLeave:string | null;
  LeaveStartDate:any;
  LeaveEndDate:any;
  StartDateAttendanceOption:any;
  EndDateAttendanceOption:any;
  IsAdhocLeave:any;
  AdhocLeaveStatus:any;
  PhoneNumber:number;
  AlternatePhoneNumber:number|null;
  AvailibiltyOnPhone:any;
  AvailibiltyInCity:any;

}
