using Microsoft.AspNetCore.Mvc;
using System.Net;
using WorkSpaceAPIEntites.ViewModels.TimeLogControllerViewModel;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPI.Controllers
{
    [Route("api/[controller]")]
    public class TimeLogController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ITimeLogRepository _timeLogRepository;
        public TimeLogController(IConfiguration configuration, ITimeLogRepository timeLogRepository)

        {
            _configuration = configuration;
            _timeLogRepository = timeLogRepository;
        }
        #region GetTimeLogDetail 
        [HttpPost]
        [Route("GetTimeLogDetail")]
        public IActionResult GetTimeLogDetail([FromBody] GetTimeLogDetailsViewModelRequest searchparams)
        {
            GetTimeLogDetailsViewModelResponse? getTimeLogDetailsViewModelResponse = new GetTimeLogDetailsViewModelResponse();
            getTimeLogDetailsViewModelResponse = _timeLogRepository.GetTimeLogDetail(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (getTimeLogDetailsViewModelResponse == null)
            {
                return Ok("No records found!!");

            }
            return Ok(getTimeLogDetailsViewModelResponse);
        }
        #endregion

        #region GetTimeLogYearly
        [HttpPost]
        [Route("GetTimeLogYearly")]

        public IActionResult GetTimeLogYearly([FromBody] GetTimeLogYearlyRequest searchparams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                List<GetTimeLogYearlyResponse> response = _timeLogRepository.GetTimeLogYearly(searchparams, out HttpStatusCode? statusCode, out string? errorText);
                if (statusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                var timeLog = new timeLogModel()
                {
                    timeLogYearlyList = response
                };
                return Ok(timeLog);
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in GetTimeLogYearly with Error : " + ex.Message, statusCode: (int)HttpStatusCode.InternalServerError);
            }
        }
        #endregion

        #region GetTimeLogMonthlyHover
        [HttpPost]
        [Route("GetTimeLogMonthlyHover")]
        public IActionResult GetTimeLogMonthlyHover([FromBody] HoverTimeLogMonthlyRequest searchparams)
        {
            List<HoverTimeLogMonthlyResponse>? hoverTimeLogMonthlyResponse = new List<HoverTimeLogMonthlyResponse>();
            hoverTimeLogMonthlyResponse = _timeLogRepository.GetTimeLogMonthlyHover(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (hoverTimeLogMonthlyResponse == null)
            {
                return Ok(hoverTimeLogMonthlyResponse);

            }

            return Ok(hoverTimeLogMonthlyResponse);
        }
        #endregion
    }
}
