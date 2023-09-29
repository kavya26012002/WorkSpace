using Microsoft.AspNetCore.Mvc;
using System.Net;
using WorkSpaceAPIRepository.Interface;
using WorkSpaceAPIEntites.ViewModels.ProductBacklogWorkItemControllerViewModel;
using WorkSpaceAPIEntites.ViewModels.Common;

namespace WorkSpaceAPI.Controllers
{
    [Route("api/[controller]")]

    public class ProductBacklogWorkItemController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IProductBacklogWorkItemRepository _productBacklogWorkItemRepository;
        public ProductBacklogWorkItemController(IConfiguration configuration, IProductBacklogWorkItemRepository productBacklogWorkItemRepository)
        {
            _configuration = configuration;
            _productBacklogWorkItemRepository = productBacklogWorkItemRepository;
        }

        #region GetProductBacklogWorkItemDetailsList
        [HttpPost]
        [Route("GetProductBacklogWorkItemDetailsList")]
        public IActionResult GetProductBacklogWorkItemDetailsList([FromBody] ProductBacklogViewModelRequest searchparams)
        {
            List<ProductBacklogViewModelResponse>? productBacklogViewModelResponse = new List<ProductBacklogViewModelResponse>();
            productBacklogViewModelResponse = _productBacklogWorkItemRepository.GetProductBacklogWorkItemDetailsList(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (productBacklogViewModelResponse == null)
            {
                return Ok(productBacklogViewModelResponse);

            }

            return Ok(productBacklogViewModelResponse);
        }
        #endregion

        #region AddAttachment

        [HttpPost]
        [Route("AddWorkItemAttachment")]
        public async Task<IActionResult> AddWorkItemAttachment([FromForm] long projectWorkId, [FromForm] string? description)
        {
            var formCollection = await Request.ReadFormAsync();
            var files = formCollection.Files;
            string assestPath = "C:\\Users\\pci60\\Desktop\\Angular Project\\wsproject\\src\\assets";
            CommonResponse<string> response = new CommonResponse<string>();
            foreach (var file in files)
            {
                string ImagePath = "";
                string ContentType = "";
                if (file != null)
                {
                    string directory = $"{assestPath}/Uploads/ProjectWorkItemAttchments/";
                    if (!Directory.Exists(directory))
                    {
                        Directory.CreateDirectory(directory);
                    }
                    string newfilename = $"{Path.GetFileNameWithoutExtension(file?.FileName)}-{DateTime.Now.ToString("yyyyMMddhhmmss")}.{Path.GetExtension(file?.FileName)?.Trim('.')}";
                    string path = $"{directory}{newfilename}";
                    using (FileStream fs = new FileStream(path, FileMode.Create))
                    {
                        if (file != null)
                            await file.CopyToAsync(fs);
                        ImagePath = $"/assets/Uploads/ProjectWorkItemAttchments/{newfilename}";
                        ContentType = Path.GetExtension(file?.FileName) ?? String.Empty;

                        AddWorkItemAttachmentRequest addWorkItemAttachmentRequest = new AddWorkItemAttachmentRequest();
                        addWorkItemAttachmentRequest.ProjectWorkId = projectWorkId;
                        addWorkItemAttachmentRequest.Description = description;
                        _productBacklogWorkItemRepository.AddWorkItemAttachment(addWorkItemAttachmentRequest, file?.FileName, ImagePath, ContentType, out HttpStatusCode? StatusCode, out string? errorText);
                        response.ErrorMessage = errorText ?? string.Empty;
                        response.Responce = errorText ?? string.Empty;
                        if (StatusCode != HttpStatusCode.OK)
                        {
                            response.IsError = true;
                            return BadRequest(errorText);
                        }
                    }
                }
            }
            response.IsError = false;
            return Ok(response);
        }

        #endregion


        #region GetWorkItemAttachment
        [HttpPost]
        [Route("GetWorkItemAttachment")]
        public IActionResult GetWorkItemAttachment([FromBody] GetWorkItemAttachmentRequest searchparams)
        {
            List<GetWorkItemAttachmentResponse>? getWorkItemAttachmentResponse = new List<GetWorkItemAttachmentResponse>();
            getWorkItemAttachmentResponse = _productBacklogWorkItemRepository.GetWorkItemAttachment(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            CommonResponse<List<GetWorkItemAttachmentResponse>> response = new CommonResponse<List<GetWorkItemAttachmentResponse>>();
            response.ErrorMessage = errorText ?? string.Empty;
            response.Responce = getWorkItemAttachmentResponse;
            if(StatusCode != HttpStatusCode.OK)
            {
                response.IsError = true;
                return BadRequest(response);
            }
            else if(StatusCode == HttpStatusCode.NotFound)
            {
                response.IsError = true;
                return BadRequest(errorText);
            }
            response.IsError = false;
            return Ok(response);
        }
        #endregion

        #region DeleteWorkItemAttachment
        [HttpPost]
        [Route("DeleteWorkItemAttachment")]
        public IActionResult DeleteWorkItemAttachment([FromBody] DeleteWorkItemAttachmentRequest deleteAttachmentParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _productBacklogWorkItemRepository.DeleteWorkItemAttachment(deleteAttachmentParams, out HttpStatusCode? StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("Attachment Deleted Successfully!..");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in DeleteLeaveRequest with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);


            }
        }
        #endregion

        #region GetManageWorkItem
        [HttpPost]
        [Route("GetManageWorkItem")]
        public IActionResult GetManageWorkItem([FromBody] GetManageWorkItemRequest searchparams)
        {
            GetManageWorkItemTotalRsponse? getManageWorkItemTotalResponse = new GetManageWorkItemTotalRsponse();
            getManageWorkItemTotalResponse = _productBacklogWorkItemRepository.GetManageWorkItem(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            if (StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(errorText);
            }
            else if (getManageWorkItemTotalResponse == null)
            {
                return Ok("No records found!!");

            }
            return Ok(getManageWorkItemTotalResponse);
        }
        #endregion

        #region UpdateWorkItems
        [HttpPost]
        [Route("UpdateWorkItems")]
        public IActionResult UpdateWorkItems([FromBody] UpdateWorkItemRequest updateparams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                 _productBacklogWorkItemRepository.UpdateWorkItems(updateparams, out HttpStatusCode StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("Workitem Request Updated  Succesfully!..");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in the UpdateWorkItems with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);
            }
        }
        #endregion

        #region GetWorkItemComment
        [HttpPost]
        [Route("GetWorkItemComment")]
        public IActionResult GetWorkItemComment([FromBody] GetWorkItemCommentRequest searchparams)
        {
            List<GetWorkItemCommentResponse>? getWorkItemCommentTotalResponse = new List<GetWorkItemCommentResponse>();
            getWorkItemCommentTotalResponse = _productBacklogWorkItemRepository.GetWorkItemComment(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            CommonResponse<List<GetWorkItemCommentResponse>> response = new CommonResponse<List<GetWorkItemCommentResponse>>();
            response.ErrorMessage = errorText ?? string.Empty;
            response.Responce = getWorkItemCommentTotalResponse;

            if (StatusCode != HttpStatusCode.OK)
            {
                response.IsError = true;
                return BadRequest(response);
            }

            response.IsError = false;
            return Ok(response);
        }
        #endregion

        #region AddWorkItemComments
        [HttpPost]
        [Route("AddWorkItemComments")]
        public IActionResult AddWorkItemComments([FromBody] AddWorkItemCommentRequest addWorkItemCommentRequest)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _productBacklogWorkItemRepository.AddWorkItemComments(addWorkItemCommentRequest, out HttpStatusCode? StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("Comments Addded Successfully!..");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in AddWorkItemComments with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);
            }
        }

        #endregion

        #region DeleteWorkItemComment
        [HttpPost]
        [Route("DeleteWorkItemComment")]
        public IActionResult DeleteWorkItemComment([FromBody] DeleteWorkItemComments deleteAttachmentParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _productBacklogWorkItemRepository.DeleteWorkItemComment(deleteAttachmentParams, out HttpStatusCode? StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("Comments Deleted Successfully!..");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in DeleteLeaveRequest with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);


            }
        }
        #endregion

        #region GetWorkState
        [HttpPost]
        [Route("GetWorkItemState")]
        public IActionResult GetWorkItemState([FromBody] GetWorkItemCommentRequest searchparams)
        {
            List<WorkState>? projectsResponse = new List<WorkState>();
            projectsResponse = _productBacklogWorkItemRepository.GetWorkItemState(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            CommonResponse<List<WorkState>> response = new CommonResponse<List<WorkState>>();
            response.ErrorMessage = errorText ?? string.Empty;
            response.Responce = projectsResponse;
            if (StatusCode != HttpStatusCode.OK)
            {
                response.IsError = true;
                return BadRequest(errorText);
            }
            else if (projectsResponse == null)
            {
                response.IsError = true;
                return BadRequest(errorText);
            }
            response.IsError = false;
            return Ok(response);
        }
        #endregion

        #region GetWorkLogHistory
        [HttpPost]
        [Route("GetWorkLogHistory")]
        public IActionResult GetWorkLogHistory([FromBody] GetWorkItemCommentRequest searchparams)
        {
            List<GetWorkLogHistoryResponse>? getWorkLogHistoryResponse = new List<GetWorkLogHistoryResponse>();
            getWorkLogHistoryResponse = _productBacklogWorkItemRepository.GetWorkLogHistory(searchparams, out HttpStatusCode? StatusCode, out string? errorText);
            CommonResponse<List<GetWorkLogHistoryResponse>> response = new CommonResponse<List<GetWorkLogHistoryResponse>>();
            response.ErrorMessage = errorText ?? string.Empty;
            response.Responce = getWorkLogHistoryResponse;

            if (StatusCode != HttpStatusCode.OK)
            {
                response.IsError = true;
                return BadRequest(response);
            }

            response.IsError = false;
            return Ok(response);
        }
        #endregion

        #region UpdateWorkLogHistory
        [HttpPost]
        [Route("UpdateWorkLogHistory")]
        public IActionResult UpdateWorkLogHistory([FromBody] UpdateWorkLogHistory updateparams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _productBacklogWorkItemRepository.UpdateWorkLogHistory(updateparams, out HttpStatusCode StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("WorkLogHistory Updated  Succesfully!..");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in the UpdateWorkLogHistory with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);
            }
        }
        #endregion

        #region DeleteWorkLogEntry
        [HttpPost]
        [Route("DeleteWorkLogEntry")]
        public IActionResult DeleteWorkLogEntry([FromBody] DeleteWorkLogHistory deleteAttachmentParams)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _productBacklogWorkItemRepository.DeleteWorkLogEntry(deleteAttachmentParams, out HttpStatusCode? StatusCode, out string? errorText);
                if (StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(errorText);
                }
                return Ok("WorkLog Deleted Successfully!..");
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in DeleteWorkLogEntry with error : " + ex.Message, statusCode: (int?)HttpStatusCode.InternalServerError);


            }
        }
        #endregion


        #region GetHistoryTable
        [HttpPost]
        [Route("GetHistoryTable")]
        public IActionResult GetHistoryTable([FromBody] GetHistoryTable filterParams)
        {
            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                List<GetHistoryTableResponse> response = _productBacklogWorkItemRepository.GetHistoryTable(filterParams, out HttpStatusCode? StatusCode, out string? errorText);

                if (StatusCode != HttpStatusCode.OK)
                {

                    return BadRequest(errorText);
                }
                var leaveRequest = new HistoryTableRequestModel()
                {
                    historyRequestList = response
                };
                return Ok(leaveRequest);
            }
            catch (Exception ex)
            {
                return Problem($"Something went wrong in GetLeaveRequest with Error : " + ex.Message, statusCode: (int)HttpStatusCode.InternalServerError);
            }
        }
        #endregion
    }
}
