using Microsoft.AspNetCore.Mvc;
using System.Net;
using WorkSpaceAPI.Attributes;
using WorkSpaceAPIEntites.ViewModels.WorkItemControllerViewModel;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkItemController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IWorkItemRepository _workItemRepository;
        public WorkItemController(IConfiguration configuration, IWorkItemRepository workItemRepository)

        {
            _configuration = configuration;
            _workItemRepository = workItemRepository;
        }
            #region To get GetWorkItemsList & filters
        [HttpPost]
        [Route("GetWorkItemsList")]
        //[EmployeeAuthorization]
        public IActionResult GetWorkItemsList([FromBody] GetWorkItemDetailsViewModelRequest filterParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                List<GetWorkItemDetailsViewModelResponse> response = _workItemRepository.GetWorkItemsList(filterParams, out HttpStatusCode? StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                var workItem = new WorkItemModel()
                {
                    workItemList = response
                };
                return Ok(workItem);
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in GetLeaveRequest with Error : " + ex.Message, statusCode: (int)HttpStatusCode.InternalServerError);
            }
        }
        #endregion

            #region ReportingPersonName
            [HttpPost]
            [Route("GetReportedByDropdownForCreateWorkItem")]
            public IActionResult GetAllEmployeeName([FromBody] GetEmployeeDetailsForInsertingWorkItemViewModelRequest getEmployeeDetailsParams)
            {
                try
                {
                    if (!ModelState.IsValid)
                    {
                        return BadRequest(ModelState);
                    }
                   List<GetEmployeeDetailsForInsertingWorkItemViewModelResponse> response = _workItemRepository.GetAllEmployeeName(getEmployeeDetailsParams, out HttpStatusCode StatusCode, out string? errorText);
                    if (StatusCode != HttpStatusCode.OK)
                    {
                        return BadRequest(errorText);
                    }
                    return Ok(response);
                }
                catch (Exception ex)
                {
                    return Problem($"Something went wrong in the GetEmployeeDetails with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);
                }
            }
            #endregion

            #region Add WorkItem
        [HttpPost]
        [Route("WorkItem-Add")]
        public IActionResult AddWorkItemRequest([FromBody] InsertWorkItemViewModelRequest addWorkItemRequestParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _workItemRepository.AddWorkItemRequest(addWorkItemRequestParams, out HttpStatusCode? StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("Work Item Successfully Added");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in AddLeaveRequest with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);
            }
        }
        #endregion

            #region UpdateWorkItem (Add WorkLog)
        [HttpPost]
        [Route("UpdateWorkItem - Add WorkLog")]
        public IActionResult UpdateWorkItem([FromBody] UpdateWorkItemViewModelRequest updateWorkItemsParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                UpdateWorkItemViewModelResponse response = _workItemRepository.UpdateWorkItem(updateWorkItemsParams, out HttpStatusCode StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("WorkLog Added Successfully");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in the UpdateLeaveRequest with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);
            }
        }
        #endregion

            #region GetUpdateWorkItemDetails
        [HttpPost]
        [Route("GetUpdateWorkItemDetails")]
        public IActionResult GetUpdateWorkItemDetails([FromBody] GetUpdateWorkItemsViewModelRequest getworkitemsRequestParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                GetUpdateWorkItemsViewModelResponse response = _workItemRepository.GetUpdateWorkItemDetails(getworkitemsRequestParams, out HttpStatusCode StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in the GetDetailsForUpdateLeaveRequest with error :" + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);
            }
        }
        #endregion
    }
}
