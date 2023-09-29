export interface GetTimeLog{
    EmployeeId: number;
    Month:any;
    Year:any;

}
export interface GetTimeLogDetailsTopPartViewModelResponse
{
    employeeNo: number;
    name: string;
    shift: string;
    experience: any;
    hours: any;
    avgTimeLog: any;
    outHours: any;
    presentDays: any;
    halfLeave: any;
    leaveDays: any;
    avgWorkLog: any;
    difference: any;
}
export interface GetTimeLogDetailsBottomPartViewModelResponse
{
    date: any;
    lateComer: any;
    firstInTime: any;
    lastOutTime:any;
    totalOutHours:any;
    timeLog:any;
    workLog:any;
   
}
export interface GetTimeLogYearlyRequest
{
    EmployeeId:number;
    Year:number | null;
}
export interface HoverTimeLogMonthlyRequest
{
    EmployeeId:number;
    LogDate:any;
    Month:number|null;
    Year:number|null;
}
