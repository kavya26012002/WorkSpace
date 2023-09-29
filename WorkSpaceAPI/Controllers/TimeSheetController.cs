using Microsoft.AspNetCore.Mvc;
using System.Net;
using WorkSpaceAPIEntites.ViewModels.TimeSheetControllerViewModel;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPI.Controllers
{
    [Route("api/[controller]")]
    public class TimeSheetController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ITimeSheetRepository _timeSheetRepository;
        public TimeSheetController(IConfiguration configuration, ITimeSheetRepository timeSheetRepository)

        {
            _configuration = configuration;
            _timeSheetRepository = timeSheetRepository;
        }
        #region GetSheetDetail
        [HttpPost]
        [Route("GetSheetDetail")]
        public IActionResult GetTimeSheetDetail([FromBody] GetTimeSheetDetailsViewModelRequest searchparams)
        {
            List<TimesheetDetailsViewModelResponse>? timesheetDetailsViewModelResponse = new List<TimesheetDetailsViewModelResponse>();
            timesheetDetailsViewModelResponse = _timeSheetRepository.GetTimeSheetDetail(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if(timesheetDetailsViewModelResponse == null)
            {
                return Ok(timesheetDetailsViewModelResponse);

            }

            return Ok(timesheetDetailsViewModelResponse);
        }
        #endregion

        #region GetTimeSheetAttendanceDetails
        [HttpPost]
        [Route("GetTimeSheetAttendanceDetails")]
        public IActionResult GetTimeSheetAttendanceDetails([FromBody] GetTimeSheetDetailsViewModelRequest searchparams)
        {
            TimesheetAttendanceDetailsViewModelResponse? timesheetAttendanceDetailsViewModelResponse = new TimesheetAttendanceDetailsViewModelResponse();
            timesheetAttendanceDetailsViewModelResponse = _timeSheetRepository.GetTimeSheetAttendanceDetails(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (timesheetAttendanceDetailsViewModelResponse == null)
            {
                return Ok(timesheetAttendanceDetailsViewModelResponse);

            }
            return Ok(timesheetAttendanceDetailsViewModelResponse);
        }
        #endregion

        #region GetTimeSheetDailyTimeLogEmployeeAndDate
        [HttpPost]
        [Route("GetTimeSheetDailyTimeLogEmployeeAndDate")]
        public IActionResult GetTimeSheetDailyTimeLogEmployeeAndDate([FromBody] GetTimeSheetDetailsViewModelRequest searchparams)
        {
            List<GetTimeSheetDailyTimeLogEmployeeAndDateResponse>? getTimeSheetDailyTimeLogEmployeeAndDateResponse = new List<GetTimeSheetDailyTimeLogEmployeeAndDateResponse>();
            getTimeSheetDailyTimeLogEmployeeAndDateResponse = _timeSheetRepository.GetTimeSheetDailyTimeLogEmployeeAndDate(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (getTimeSheetDailyTimeLogEmployeeAndDateResponse == null)
            {
                return Ok(getTimeSheetDailyTimeLogEmployeeAndDateResponse);

            }

            return Ok(getTimeSheetDailyTimeLogEmployeeAndDateResponse);
        }
        #endregion

        #region GetTimeSheetDailyTimeLogggEmployeeAndDate
        [HttpPost]
        [Route("GetTimeSheetDailyTimeLogggEmployeeAndDate")]
        public IActionResult GetTimeSheetDailyTimeLogggEmployeeAndDate([FromBody] GetTimeSheetDetailsViewModelRequest searchparams)
        {
            List<GetTimeSheetDailyTimeLogggEmployeeAndDateResponse>? getTimeSheetDailyTimeLogggEmployeeAndDateResponse = new List<GetTimeSheetDailyTimeLogggEmployeeAndDateResponse>();
            getTimeSheetDailyTimeLogggEmployeeAndDateResponse = _timeSheetRepository.GetTimeSheetDailyTimeLogggEmployeeAndDate(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (getTimeSheetDailyTimeLogggEmployeeAndDateResponse == null)
            {
                return Ok(getTimeSheetDailyTimeLogggEmployeeAndDateResponse);

            }

            return Ok(getTimeSheetDailyTimeLogggEmployeeAndDateResponse);
        }
        #endregion

        #region GetTimeSheetHover
        [HttpPost]
        [Route("GetTimeSheetHover")]
        public IActionResult GetTimeSheetHover([FromBody] TimeSheetHoverViewModelRequest searchparams)
        {
            List<TimeSheetHoverViewModelResponse>? timeSheetHoverViewModelResponse = new List<TimeSheetHoverViewModelResponse>();
            timeSheetHoverViewModelResponse = _timeSheetRepository.GetTimeSheetHover(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (timeSheetHoverViewModelResponse == null)
            {
                return Ok(timeSheetHoverViewModelResponse);

            }

            return Ok(timeSheetHoverViewModelResponse);
        }
        #endregion

    }
}
