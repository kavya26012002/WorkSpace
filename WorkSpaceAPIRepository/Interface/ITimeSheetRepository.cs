using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkSpaceAPIEntites.ViewModels.TimeSheetControllerViewModel;

namespace WorkSpaceAPIRepository.Interface
{
    public interface ITimeSheetRepository
    {
        public List<TimesheetDetailsViewModelResponse> GetTimeSheetDetail(GetTimeSheetDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public List<GetTimeSheetDailyTimeLogEmployeeAndDateResponse> GetTimeSheetDailyTimeLogEmployeeAndDate(GetTimeSheetDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public List<GetTimeSheetDailyTimeLogggEmployeeAndDateResponse> GetTimeSheetDailyTimeLogggEmployeeAndDate(GetTimeSheetDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public List<TimeSheetHoverViewModelResponse> GetTimeSheetHover(TimeSheetHoverViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);

        TimesheetAttendanceDetailsViewModelResponse GetTimeSheetAttendanceDetails(GetTimeSheetDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
    }
}
