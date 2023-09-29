using Microsoft.AspNetCore.Mvc;
using System.Net;
using WorkSpaceAPIEntites.ViewModels.AttendanceControllerViewModel;
using WorkSpaceAPIEntites.ViewModels.Common;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IAttendanceRepository _attendanceRepository;
        public AttendanceController(IConfiguration configuration, IAttendanceRepository attendanceRepository)

        {
            _configuration = configuration;
            _attendanceRepository = attendanceRepository;
        }
        #region GetAttendance
        [HttpPost]
        [Route("GetAttendance")]
        public IActionResult GetAttendance(SearchAttendancerequest searchAttendance)
        {
            List<AttendanceResponse>? attendance = new List<AttendanceResponse>();
            attendance = _attendanceRepository.GetAttendance(searchAttendance, out HttpStatusCode? StatusCode, out string? errorText);
            CommonResponse<List<AttendanceResponse>?> response = new CommonResponse<List<AttendanceResponse>?>();
            response.ErrorMessage = errorText ?? string.Empty;
            response.Responce = attendance;
            if (StatusCode != HttpStatusCode.OK)
            {
                response.IsError = true;
                return BadRequest(errorText);
            }
            else if (attendance == null)
            {
                response.IsError = true;
                return BadRequest(errorText);
            }
            response.IsError = false;
            return Ok(response);
        }

        #endregion

        #region Add or Update Attendance
        [HttpPost]
        [Route("AddOrUpdateAttendance")]
        public IActionResult AddOrUpdateAttendance(AttendanceRequest attendanceRequest)
        {
            _attendanceRepository.AddOrUpdateAttendance(attendanceRequest, out HttpStatusCode? StatusCode, out string? errorText);
            CommonResponse<string> response = new CommonResponse<string>();
            response.ErrorMessage = errorText ?? string.Empty;
            response.Responce = errorText;
            if (StatusCode != HttpStatusCode.OK)
            {
                response.IsError = true;
                return BadRequest(errorText);
            }
            response.IsError = false;
            return Ok(response);
        }

        #endregion
        #region ApproveAttendance
        [HttpPost]
        [Route("ApproveAttendance")]
        public IActionResult ApproveAttendance(ApproveAttendanceRequest approveAttendanceRequest)
        {
            _attendanceRepository.ApproveAttendance(approveAttendanceRequest, out HttpStatusCode? StatusCode, out string? errorText);
            CommonResponse<string> respose = new CommonResponse<string>();
            respose.ErrorMessage = errorText ?? string.Empty;
            respose.Responce = errorText;
            if (StatusCode != HttpStatusCode.OK)
            {
                respose.IsError = true;
                return BadRequest(errorText);
            }
            respose.IsError = false;
            return Ok(respose);
        }

        #endregion
        #region Get Holiday List
        [HttpGet]
        [Route("HolidayList")]
        public IActionResult GetHoliDayList()
        {
            List<GetHoliday>? getDropdownModel = new List<GetHoliday>();
            getDropdownModel = _attendanceRepository.GetHoliDayList(out HttpStatusCode? StatusCode, out string? errorText);
            CommonResponse<List<GetHoliday>?> response = new CommonResponse<List<GetHoliday>?>();
            response.ErrorMessage = errorText ?? string.Empty;
            response.Responce = getDropdownModel;
            if (StatusCode != HttpStatusCode.OK)
            {
                response.IsError = true;
                return BadRequest(errorText);
            }
            response.IsError = false;
            return Ok(response);
        }
        #endregion
    }
}
