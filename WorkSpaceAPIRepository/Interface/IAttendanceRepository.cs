using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkSpaceAPIEntites.ViewModels.AttendanceControllerViewModel;

namespace WorkSpaceAPIRepository.Interface
{
    public interface IAttendanceRepository
    {
        List<AttendanceResponse>? GetAttendance(SearchAttendancerequest searchAttendance, out HttpStatusCode? statusCode, out string? errorText);
        void AddOrUpdateAttendance(AttendanceRequest attendanceRequest, out HttpStatusCode? statusCode, out string? errorText);
        void ApproveAttendance(ApproveAttendanceRequest approveAttendanceRequest, out HttpStatusCode? statusCode, out string? errorText);
        List<GetHoliday>? GetHoliDayList(out HttpStatusCode? statusCode, out string? errorText);
    }
}
