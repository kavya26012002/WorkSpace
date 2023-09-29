using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.TimeSheetControllerViewModel
{
    public class TimesheetDetailsViewModelResponse
    {
        public List<string> ColumnNames { get; set; } 
        public string? ProjectName { get; set; }
        public string? ProjectTitle { get; set; }
        public decimal? P { get; set; }
        public decimal? TotalWorkLog { get; set; }
        public Dictionary<DateTime, decimal?> DateValues { get; set; }
        public decimal? DailyTimeLogHours { get; set; }
    }
    public class GetTimeSheetDailyTimeLogEmployeeAndDateResponse
    {
        public DateTime? WorkDoneOn { get; set; }
        public decimal? WorkTime { get; set; }
    }
    public class GetTimeSheetDailyTimeLogggEmployeeAndDateResponse
    {
        public DateTime? LogDate { get; set; }
        public decimal? TimeLog { get; set; }
    }

    //public class TimesheetDetailsViewModelResponse
    //{
    //    public string? ProjectName { get; set; }
    //    public string? ProjectTitle { get; set; }
    //    public decimal? P { get; set; }
    //    public decimal? TotalWorkLog { get; set; }
    //    public Dictionary<DateTime, decimal?> DateValues { get; set; }
    //    public decimal? DailyTimeLogHours { get; set; }
    //}
    public class TimesheetAttendanceTopDetailsViewModelResponse
    {
        public long EmployeeId { get; set; }
       
       
        public DateTime?FullDayLeaveDates { get; set; } 
    }
    public class TimesheetAttendanceBottomDetailsViewModelResponse
    {
        public long EmployeeId { get; set; }
        public DateTime? HalfDayLeaveDates { get; set; }
    }
    public class TimesheetAttendanceHolidayListViewModelResponse
    {
        public string HolidayName { get; set; }
        public DateTime? HolidayDate { get; set; }
    }
    public class TimesheetAttendanceDetailsViewModelResponse
    {
        public List<TimesheetAttendanceTopDetailsViewModelResponse>? timesheetAttendanceTopDetailsViewModelResponse { get; set; }
        public List<TimesheetAttendanceBottomDetailsViewModelResponse>? timesheetAttendanceBottomDetailsViewModelResponse { get; set; }
        public List<TimesheetAttendanceHolidayListViewModelResponse>? timesheetAttendanceHolidayListViewModelResponse { get; set; }

    }
    public class TimeSheetHoverViewModelResponse
    {
        public string Title { get; set; }
        public decimal? OriginalEstimate { get; set; }
        public decimal? SpentTime { get; set; }
        public decimal Remaining { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }


    }







}
