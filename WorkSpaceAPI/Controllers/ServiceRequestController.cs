using Microsoft.AspNetCore.Mvc;
using System.Net;
using WorkSpaceAPIEntites.ViewModels.ServiceRequestControllerViewModel;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceRequestController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IServiceRequestRepository _serviceRequestRepository;
        public ServiceRequestController(IConfiguration configuration, IServiceRequestRepository serviceRequestRepository)

        {
            _configuration = configuration;
            _serviceRequestRepository = serviceRequestRepository;
        }
        #region To get ServiceRequestDetails & filters
        [HttpPost]
        [Route("ServiceRequestDetails")]
        public IActionResult GetServiceRequest([FromBody] GetServiceRequestDetailsViewModel filterParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                List<GetServiceResponseDetailsViewModel> response = _serviceRequestRepository.GetServiceRequest(filterParams, out HttpStatusCode? StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                var serviceRequest = new serviceRequestModel()
                {
                    serviceRequestList = response
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong  in GetServiceRequest with error: " + ex.Message, statusCode: (int)HttpStatusCode.InternalServerError);
            }
        }

        #endregion

        #region Add ServiceRequest
        [HttpPost]
        [Route("ServiceRequest-Add")]
        public IActionResult AddServiceRequest([FromBody] InsertServiceRequestViewModelRequest addServiceRequestParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _serviceRequestRepository.AddServiceRequest(addServiceRequestParams, out HttpStatusCode? StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("Service Request Successfully Added");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in AddServiceRequest with error : " + ex.Message, statusCode: (int)HttpStatusCode.InternalServerError);
            }
        }
        #endregion

        #region GetServiceDetails Employee Insert details with Filling dropDown
        [HttpPost]
        [Route("GetServiceRequestInsertandDropdown")]
        public IActionResult GetServiceDetailswithfillingDropdown([FromBody] GetServiceRequestInsertDetailsViewModelRequest searchParams)
        {
            GetServiceRequestInsertDetailsDropDownViewModelResponse? getServiceRequestInsertDetailsDropDownViewModelResponse = new GetServiceRequestInsertDetailsDropDownViewModelResponse();
            getServiceRequestInsertDetailsDropDownViewModelResponse = _serviceRequestRepository.GetServiceDetailswithfillingDropdown(searchParams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (getServiceRequestInsertDetailsDropDownViewModelResponse == null)
            {
                return BadRequest(errorText);
            }
            return Ok(getServiceRequestInsertDetailsDropDownViewModelResponse);
        }
        #endregion

        #region UpdateServiceRequest
        [HttpPost]
        [Route("UpdateServiceRequest")]
        public IActionResult UpdateServiceRequest([FromBody] UpdateServiceRequestViewModelRequest updateServiceRequestParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                UpdateServiceRequestViewModelResponse response = _serviceRequestRepository.UpdateServiceRequest(updateServiceRequestParams, out HttpStatusCode StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("Updated Service Request Successfully");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in the UpdateServiceRequest with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);
            }
        }
        #endregion

        #region CategoryDropdown
        [HttpPost]
        [Route("GetCategoryDropdown")]
        public IActionResult GetCategoryDropdown([FromBody] GetServiceCategoryDropdownViewModelRequest serachParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                List<GetServiceCategoryDropdownViewModelResponse> response = _serviceRequestRepository.GetCategoryDropdown(serachParams, out HttpStatusCode? StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                var serviceRequest = new serviceRequestModel()
                {
                    categoryDropdownlist = response
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong  in GetCategoryDropdown with error: " + ex.Message, statusCode: (int)HttpStatusCode.InternalServerError);
            }

        }
        #endregion

        #region SubCategoryDropdown
        [HttpPost]
        [Route("GetSubCategoryDropdown")]
        public IActionResult GetSubCategoryDropdown([FromBody] GetServiceSubCategoryDropdownViewModelRequest serachParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                List<GetServiceSubCategoryDropdownViewModelResponse> response = _serviceRequestRepository.GetSubCategoryDropdown(serachParams, out HttpStatusCode? StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                var serviceRequest = new serviceRequestModel()
                {
                    subCategoryDropdownlist = response
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong  in GetSubCategoryDropdown with error: " + ex.Message, statusCode: (int)HttpStatusCode.InternalServerError);
            }

        }
        #endregion

        #region UpdateServiceRequestDetails
        [HttpPost]
        [Route("UpdateServiceRequestDetails")]
        public IActionResult UpdateServiceRequestDetails([FromBody] GetUpdateServiceDetailsViewModelRequest serachParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                List<GetUpdateServiceDetailsViewModelResponse> response = _serviceRequestRepository.UpdateServiceRequestDetails(serachParams, out HttpStatusCode? StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                var serviceRequest = new serviceRequestModel()
                {
                    updateservicerequestlist = response
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong  in UpdateServiceRequestDetails with error: " + ex.Message, statusCode: (int)HttpStatusCode.InternalServerError);
            }

        }
        #endregion

       #region GetUpdateServiceRequestCategoryDropdownEmployeeDetails
        [HttpPost]
        [Route("GetUpdateServiceRequestCategoryDropdownEmployeeDetails")]
        public IActionResult GetUpdateServiceRequestCategoryDropdownEmployeeDetails([FromBody] GetUpdateCategoryDropdown searchparams)
        {
            UpdateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse? updateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse = new UpdateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse();
            updateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse = _serviceRequestRepository.GetUpdateServiceRequestCategoryDropdownEmployeeDetails(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (updateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse == null)
            {
                return Ok("No records found!!");

            }
            return Ok(updateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse);
        }
        #endregion

        #region GetUpdateServiceRequestSubCategoryDropdownEmployeeDetails
        [HttpPost]
        [Route("GetUpdateServiceRequestSubCategoryDropdownEmployeeDetails")]
        public IActionResult GetUpdateServiceRequestSubCategoryDropdownEmployeeDetails([FromBody] GetUpdateSubCategoryDropdown searchparams)
        {
            UpdateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse? updateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse = new UpdateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse();
            updateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse = _serviceRequestRepository.GetUpdateServiceRequestSubCategoryDropdownEmployeeDetails(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (updateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse == null)
            {
                return Ok("No records found!!");

            }
            return Ok(updateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse);
        }
        #endregion

        #region ChangeServiceRequestStatus
        [HttpPost]
        [Route("ChangeServiceRequest")]
        public IActionResult ChangeServiceRequest([FromBody] changeServiceRequestStatusViewModelRequest searchparams)
        {
            try
            {
                if(!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _serviceRequestRepository.ChangeServiceRequest(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
                if(StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("Service Request Changed to reopen");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in ChangeServiceRequest with error : " + ex.Message, statusCode: (int)HttpStatusCode.InternalServerError);
            }
        }
        #endregion
    }
}
