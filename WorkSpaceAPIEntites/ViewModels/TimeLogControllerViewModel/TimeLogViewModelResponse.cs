using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.TimeLogControllerViewModel
{
    public class GetTimeLogDetailsViewModelResponse
    {
        public GetTimeLogDetailsTopPartViewModelResponse? getTimeLogDetailsTopPartViewModelResponse { get; set; }
        public List<GetTimeLogDetailsBottomPartViewModelResponse>? getTimeLogDetailsBottomPartViewModelResponse { get; set; }

    }
    public class GetTimeLogDetailsTopPartViewModelResponse
    {
        public long EmployeeNo { get; set; }
        public string Name { get; set; }
        public string Shift { get; set; }
        public string? Experience { get; set; }
        public float Hours { get; set; }    
        public float AvgTimeLog  { get; set; }
        public float? OutHours { get; set; }
        public int? PresentDays { get; set; }
        public int? HalfLeave { get; set; }
        public int? LeaveDays { get; set; }
        public float? AvgWorkLog { get; set; }
        public float? Difference { get; set; }
    }

    public class GetTimeLogDetailsBottomPartViewModelResponse 
    {
        public string Date { get; set; }
        public bool? LateComer { get; set; }
        public float FirstInTime { get; set; }
        public float LastOutTime { get; set; }
        public float TotalOutHours { get; set; }
        public float TimeLog { get; set; }
        public float? WorkLog { get; set; }
        public float? OriginalEstTime { get; set; }

    }
    public class GetTimeLogYearlyResponse
    {
        public int EmployeeNo { get; set; }
        public string Name { get; set; }
        public string Month { get; set; }
        public int? PDays { get; set; }
        public int? HalfLeaves { get; set; }
        public int? LDays { get; set; }
        public float? Hours { get; set; }
        public float? AvgWorkLog { get; set; }
        public float? AvgTimeLog { get; set; }
        public float? Difference { get; set; }

    }
    public class timeLogModel
    {
        public List<GetTimeLogYearlyResponse> timeLogYearlyList { get; set; } = new List<GetTimeLogYearlyResponse>();
    }
    public class HoverTimeLogMonthlyResponse
    {
        public string? TimeIn1 { get; set; }
        public string? TimeIn2 { get; set; }
        public string? TimeOut1 { get; set; }
        public string? TimeOut2 { get; set; }
        public string? OutHours1 { get; set; }
        public string? OutHours2 { get; set; }
        public string? WorkHours1 { get; set; }
        public string? WorkHours2 { get; set; }

    }

}
