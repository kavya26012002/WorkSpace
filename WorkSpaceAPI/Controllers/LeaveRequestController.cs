using Microsoft.AspNetCore.Mvc;
using System.Net;
using WorkSpaceAPIEntites.ViewModels.LeaveRequestControllerViewModel;
using WorkSpaceAPIRepository.Interface;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WorkSpaceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveRequestController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILeaveRequestRepository _leaveRequestRepository;

        public LeaveRequestController(IConfiguration configuration, ILeaveRequestRepository leaveRequestRepository)

        {
            _configuration = configuration;
            _leaveRequestRepository = leaveRequestRepository;
        }

        #region To get LeaveRequestList & filters
        [HttpPost]
        [Route("LeaveRequestDetails")]
    public IActionResult GetLeaveRequest([FromBody] GetLeaveRequestDetailsViewModel filterParams)
   {
            try
            {

                if(!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                List<GetLeaveResponseDetailsViewModel> response = _leaveRequestRepository.GetLeaveRequest(filterParams, out HttpStatusCode? StatusCode, out string? errorText);
                
                if(StatusCode != HttpStatusCode.OK)
                {
                    
                    return BadRequest(errorText);
                }
                var leaveRequest = new LeaveRequestModel()
                {
                    leaveRequestList = response
                };
                return Ok(leaveRequest);
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in GetLeaveRequest with Error : " + ex.Message,statusCode: (int)HttpStatusCode.InternalServerError);
            }
    }
        #endregion

        #region AddLeaveRequest
        [HttpPost]
        [Route("LeaveRequest-Add")]
        public IActionResult AddLeaveRequest([FromBody] InsertLeaveRequestViewModelRequest addLeaveRequestParams)
        {
            try
            {
                if(!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _leaveRequestRepository.AddLeaveRequest(addLeaveRequestParams, out HttpStatusCode? StatusCode, out string? errorText);
                if(StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("Leave Request Successfully Added");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in AddLeaveRequest with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);
            }
        }

        #endregion

        #region GetEmployeeName,ReportingPersonName,PhoneNumber Details
        [HttpPost]
        [Route("GetEmployeeDetails")]
        public IActionResult GetEmployeeDetails([FromBody] GetEmployeeDetailsViewModelRequest getEmployeeDetailsParams)
        {
            try
            {
                if(!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                List<GetEmployeeDetailsViewModelResponse> response = _leaveRequestRepository.GetEmployeeDetails(getEmployeeDetailsParams, out HttpStatusCode StatusCode, out string? errorText);
                if(StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                var leaveRequest = new insertLeaveRequestModel()
                {
                    leaverequestinsertlist = response
                };
                return Ok(leaveRequest);
            }
            catch(Exception ex)
            {
                return Problem($"Something went wrong in the GetEmployeeDetails with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);
            }
        }
        #endregion

        #region UpdateLeaveRequest
        [HttpPost]
        [Route("UpdateLeaveRequest")]
        public IActionResult UpdateLeaveRequest([FromBody]UpdateLeaveRequestViewModelRequest updateLeaveRequestParams)
        {
            try
            {
                if(!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                UpdateLeaveRequestViewModelResponse response = _leaveRequestRepository.UpdateLeaveRequest(updateLeaveRequestParams, out HttpStatusCode StatusCode, out string? errorText);
                if(StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("Upadted Leave Request Succesfully");
            }
            catch(Exception ex)
            {
                return Problem($"Something went wrong in the UpdateLeaveRequest with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);
            }
        }
        #endregion

        #region GetUpdateLeaveRequestEmployeeDetails
        [HttpPost]
        [Route("GetEmployeeDetailsForUpdateLeaveRequest")]
        public IActionResult GetUpdateEmployeeDetail([FromBody] GetUpdateLeaveRequestViewModelRequest searchparams)
        {
            UpdateGetEmployeeDetailsModelResponse? updateGetEmployeeDetailsModelResponse = new UpdateGetEmployeeDetailsModelResponse();
            updateGetEmployeeDetailsModelResponse = _leaveRequestRepository.GetUpdateEmployeeDetail(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (updateGetEmployeeDetailsModelResponse == null)
            {
                return Ok("No records found!!");

            }
            return Ok(updateGetEmployeeDetailsModelResponse);
        }
        #endregion

        #region DeleteLeaveRequest
        [HttpPost]
        [Route("LeaveRequest-Delete")]
        public IActionResult DeleteLeaveRequest([FromBody] DeleteLeaveRequestViewModelRequest deleteLeaveRequestParams)
        {
            try
            {
                if(!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _leaveRequestRepository.DeleteLeaveRequest(deleteLeaveRequestParams, out HttpStatusCode? StatusCode, out string? errorText);
                if(StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("Leave Request Deleted Successfully");
            }
            catch(Exception ex)
                {
                return Problem($"Something went wrong in DeleteLeaveRequest with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);


            }
        }
        #endregion

    }
}
