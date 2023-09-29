export interface GetTimeSheetDetailsViewModelRequest {
  EmployeeId: number;
  Month: any;
  year: any;
}
export interface GetTimeSheetResponse {
  columnNames: string[];
  projectName: any;
  projectTitle: string | null;
  p: number | null;
  totalWorkLog: any;
  dateValues: { [key: string]: number | null };
  dailyTimeLogHours: number | null;
}
export interface GetTimeSheetDailyTimeLogEmployeeAndDateResponse
{
  workDoneOn:any;
  workTime:any;

}
export interface GetTimeSheetDailyTimeLogggEmployeeAndDateResponse
{
  logDate:any;
  timeLog:any;
}
export interface TimeSheetHoverViewModelRequest
{
  EmployeeId:any;
  ProjectId:any;
}