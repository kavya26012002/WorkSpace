using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkSpaceAPIEntites.ViewModels.Common;
using WorkSpaceAPIEntites.ViewModels.ProductBacklogWorkItemControllerViewModel;
using WorkSpaceAPIEntites.ViewModels.TimeSheetControllerViewModel;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPIRepository.Repository
{
    public class ProductBacklogWorkItemRepository : IProductBacklogWorkItemRepository
    {
        private readonly IConfiguration _configuration;

        public string? connectionString { get; private set; }
        public ProductBacklogWorkItemRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            connectionString = configuration.GetConnectionString("user");
        }
        public IDbConnection Connection
        {
            get { return new SqlConnection(connectionString); }
        }
        #region GetProductBacklogWorkItemDetailsList
        public List<ProductBacklogViewModelResponse> GetProductBacklogWorkItemDetailsList(ProductBacklogViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            List<ProductBacklogViewModelResponse> details = new List<ProductBacklogViewModelResponse>();
            {
                try
                {
                    using (IDbConnection dbConnection = Connection)
                    {
                        dbConnection.Open();
                        DynamicParameters param = new DynamicParameters();
                        param.Add("@ProjectWorkId", searchParams.ProjectWorkId);
                        param.Add("@EmployeeId", searchParams.EmployeeId);
                        details = dbConnection.Query<ProductBacklogViewModelResponse>("SP_GetProductBackLogWorkItem", param, commandType: CommandType.StoredProcedure).ToList();

                        if (details != null)
                        {
                            statusCode = HttpStatusCode.OK;
                            errorText = null;
                            return details;

                        }
                        else
                        {
                            statusCode = HttpStatusCode.NotFound;
                            errorText = "No Records Found";
                        }
                    }

                }
                catch (Exception ex)
                {
                    statusCode = HttpStatusCode.InternalServerError;
                    errorText = "Something went wrong in GetTimeLogDetail repository with Error: " + ex.Message;
                    return null;
                }
                return details;

            }
        }

        #endregion

        #region AddAttachment

        public void AddWorkItemAttachment(AddWorkItemAttachmentRequest addWorkItemAttachmentRequest, string? filename, string? filePath, string? fileType, out HttpStatusCode? statusCode, out string? errorText)
        {
            try
            {
                CommonResponseStatus responseStatus = new CommonResponseStatus();
                using(IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@ProjectWorkId", addWorkItemAttachmentRequest.ProjectWorkId);
                    param.Add("@FilePath",filePath);
                    param.Add("@FileName", filename);
                    param.Add("@Description", addWorkItemAttachmentRequest.Description);
                    param.Add("@filetype", fileType);
                    param.Add("@status", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                    param.Add("@message", dbType: DbType.String, size: 255, direction: ParameterDirection.Output);
                    dbConnection.Query("SP_AddWorkItemAttachment", param, commandType: CommandType.StoredProcedure);
                    responseStatus.Success = param.Get<bool>("@status");
                    responseStatus.Message = param.Get<string>("@message");
                    dbConnection.Close();
                    if(responseStatus.Success == false)
                    {
                        statusCode = HttpStatusCode.Unauthorized;
                        errorText = responseStatus.Message;
                        return;
                    }
                    statusCode = HttpStatusCode.OK;
                    errorText = responseStatus.Message;
                    return;
                }
            }
            catch(Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in AccountsRepository repository with Error: " + ex.Message;
            }
        }
        #endregion

        #region GetWorkItemAttachment
        public List<GetWorkItemAttachmentResponse> GetWorkItemAttachment(GetWorkItemAttachmentRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            List<GetWorkItemAttachmentResponse>? details = new List<GetWorkItemAttachmentResponse>();
            {
                try
                {
                    using(IDbConnection dbConnection = Connection)
                    {
                        dbConnection.Open();
                        DynamicParameters param = new DynamicParameters();
                        param.Add("@ProjectWorkId", searchParams.ProjectWorkId);
                        details = dbConnection.Query<GetWorkItemAttachmentResponse>("SP_GetWorkItemAttachment", param, commandType: CommandType.StoredProcedure).ToList();
                        if(details.Count == 0)
                        {
                            statusCode = HttpStatusCode.NotFound;
                            errorText = "No data found, Unable to retrieve Data!...";
                            return null;
                        }
                        statusCode = HttpStatusCode.OK;
                        errorText = "Able to retrieve Data!..";
                        return details;
                                   
                    }
                }
                catch (Exception ex)
                {
                    statusCode = HttpStatusCode.InternalServerError;
                    errorText = "Something went wrong in GetWorkItemAttachment repository with Error: " + ex.Message;
                    return null;
                }
            }
        }

        #endregion

        #region DeleteWorkItemAttachment
        public void DeleteWorkItemAttachment(DeleteWorkItemAttachmentRequest deleteAttachmentParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            try
            {
                using(IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@WorkItemAttachmentId", deleteAttachmentParams.WorkItemAttachmentId);
                    param.Add("@IsAttachmentDeleted", direction: ParameterDirection.Output, size: 150);
                    dbConnection.Query("SP_DeleteWorkItemAttachent", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@IsAttachmentDeleted");
                    if(response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Cant delete Attachment Currently..Please Try again after SomeTime!...";
                    }
                    
                }
            }
            catch(Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in DeleteWorkItemAttachment repository with error : " + ex.Message;
            }
        }


        #endregion

        #region GetManageWorkItem
      public GetManageWorkItemTotalRsponse GetManageWorkItem(GetManageWorkItemRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            GetManageWorkItemTotalRsponse getManageWorkItemTotalResponse = new GetManageWorkItemTotalRsponse();

            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@ProjectWorkID", searchParams.ProjectWorkId);
                    var details = dbConnection.QueryMultiple("SP_ManageWorkItem", param, commandType: CommandType.StoredProcedure);
                    getManageWorkItemTotalResponse.getManageWorkItemTopPartResponse = details.Read<GetManageWorkItemTopPartResponse>().ToList();
                    getManageWorkItemTotalResponse.getManageWorkItemReportingByList = details.Read<GetManageWorkItemReportingByList>().ToList();
                    getManageWorkItemTotalResponse.getManageWorkItemSubProjectList = details.Read<GetManageWorkItemSubProjectList>().ToList();
                    if (details != null)
                    {
                        statusCode = HttpStatusCode.OK;
                        errorText = null;
                        return getManageWorkItemTotalResponse;
                    }

                    else
                    {
                        statusCode = HttpStatusCode.NotFound;
                        errorText = "No Records Found";

                    }
                }
            }
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in GetManageWorkItem repository with Error: " + ex.Message;
                return null;
            }
            return getManageWorkItemTotalResponse;

        }

        #endregion


        #region UpdateWorkItem
        public void UpdateWorkItems(UpdateWorkItemRequest updateparams, out HttpStatusCode StatusCode, out string? errorText)
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@ProjectWorkId", updateparams.ProjectWorkId);
                    param.Add("@Title", updateparams.Title);
                    param.Add("@EmployeeId", updateparams.EmployeeId);
                    param.Add("@SubProjectId", updateparams.SubProjectId);
                    param.Add("@WorkGroupID", updateparams.WorkGroupId);
                    param.Add("@WorkFlow", updateparams.WorkFlow);
                    param.Add("@Priority", updateparams.Priority);
                    param.Add("@Status", updateparams.Status);
                    param.Add("@StartDate", updateparams.StartDate);
                    param.Add("@EndDate", updateparams.EndDate);
                    param.Add("@OriginalEst", updateparams.OriginalEst);
                    param.Add("@RemainingEst", updateparams.RemainingEst);
                    param.Add("@AssignedEmployeeId", updateparams.AssignedEmployeeId);
                    param.Add("@ReportedEmployeeID", updateparams.ReportedEmployeeId);
                    param.Add("@ReleasedToProduction", updateparams.ReleasedToProduction);
                    param.Add("@RSI", updateparams.RSI);
                    param.Add("@Description", updateparams.Description);
                    param.Add("@Success", direction: ParameterDirection.Output, size: 150);
                    var details = dbConnection.Query("SP_UpdateWorkItem", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@Success");
                    
                     if (response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Updatation In WorkItem Request Failed";

                    }

                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something Went wrong in UpdateLeaveRequest repository with error :" + ex.Message;
            }
        }

        #endregion

        #region GetWorkItemComment
        public List<GetWorkItemCommentResponse>? GetWorkItemComment(GetWorkItemCommentRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            List<GetWorkItemCommentResponse>? details = new List<GetWorkItemCommentResponse>();

            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@ProjectWorkId", searchParams.ProjectWorkId);
                    details = dbConnection.Query<GetWorkItemCommentResponse>("SP_GetComment", param, commandType: CommandType.StoredProcedure).ToList();

                    //getWorkItemCommentTotalResponse = dbConnection.QueryMultiple("SP_GetComment", param, commandType: CommandType.StoredProcedure).ToLis;
     
                    if (details.Count == 0)
                    {
                        statusCode = HttpStatusCode.NotFound;
                        errorText = "No Records Found";
                        return null;
                    }

                    else
                    {
                        statusCode = HttpStatusCode.OK;
                        errorText = "Able to retrieve Data!..";
                        return details;


                    }
                }
            }
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in GetManageWorkItem repository with Error: " + ex.Message;
                return null;
            }
            return details;

        }

        #endregion

        #region Add WorItem Comments
        public void AddWorkItemComments(AddWorkItemCommentRequest addWorkItemCommentRequest, out HttpStatusCode? StatusCode, out string? errorText)
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@ProjectWorkID", addWorkItemCommentRequest.ProjectWorkID);
                    param.Add("@EmployeeId", addWorkItemCommentRequest.EmployeeId);

                    param.Add("@Comments", addWorkItemCommentRequest.Comments);


                    param.Add("@IsAttachmentAdded", direction: ParameterDirection.Output, size: 150);
                    dbConnection.Query("SP_SaveComments", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@IsAttachmentAdded");
                    if (response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Cant Add Comments..Please Try After sometime";
                    }

                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in AddWorkItemComments repository with error : " + ex.Message;
            }
        }

        #endregion


        #region DeleteWorkItemComments
        public void DeleteWorkItemComment(DeleteWorkItemComments deleteAttachmentParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@CommentId", deleteAttachmentParams.CommentId);
                    param.Add("@IsCommentDeleted", direction: ParameterDirection.Output, size: 150);
                    dbConnection.Query("SP_DeleteComment", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@IsCommentDeleted");
                    if (response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Cant delete Comments Currently..Please Try again after SomeTime!...";
                    }

                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in DeleteWorkItemComments repository with error : " + ex.Message;
            }
        }


        #endregion

        #region GetWorkItemState
        public List<WorkState>? GetWorkItemState(GetWorkItemCommentRequest searchparams, out HttpStatusCode? statusCode, out string? errorText)
        {
            List<WorkState>? projectsResponse = new List<WorkState>();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@ProjectWorkId", searchparams.ProjectWorkId);
                    projectsResponse = dbConnection.Query<WorkState>("SP_GetWorkItemState ", param, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    if (projectsResponse == null)
                    {
                        statusCode = HttpStatusCode.NotFound;
                        errorText = "No data Found, Please try again!";
                        return null;
                    }

                    statusCode = HttpStatusCode.OK;
                    errorText = "Read data successfully!";
                    return projectsResponse;
                }
            }
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in ProjectRepository with Error: " + ex.Message;
                return null;
            }
        }
        #endregion

        #region GetWorkLogHistory
        public List<GetWorkLogHistoryResponse>? GetWorkLogHistory(GetWorkItemCommentRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            List<GetWorkLogHistoryResponse>? details = new List<GetWorkLogHistoryResponse>();

            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@ProjectWorkId", searchParams.ProjectWorkId);
                    details = dbConnection.Query<GetWorkLogHistoryResponse>("SP_GetWorkLogHistory", param, commandType: CommandType.StoredProcedure).ToList();

                    //getWorkItemCommentTotalResponse = dbConnection.QueryMultiple("SP_GetComment", param, commandType: CommandType.StoredProcedure).ToLis;

                    if (details.Count == 0)
                    {
                        statusCode = HttpStatusCode.NotFound;
                        errorText = "No Records Found";
                        return null;
                    }

                    else
                    {
                        statusCode = HttpStatusCode.OK;
                        errorText = "Able to retrieve Data!..";
                        return details;


                    }
                }
            }
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in GetWorkLogHistory repository with Error: " + ex.Message;
                return null;
            }
            return details;

        }

        #endregion

        #region UpdateWorkLogHistory
        public void UpdateWorkLogHistory(UpdateWorkLogHistory updateparams, out HttpStatusCode StatusCode, out string? errorText)
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@WorkLogHistoryId", updateparams.WorkLogHistoryId);
                    param.Add("@ProjectWorkID", updateparams.ProjectWorkID);
                    param.Add("@WorkDoneOn", updateparams.WorkDoneOn);
                    param.Add("@WorkTime", updateparams.WorkTime);
                    param.Add("@Description", updateparams.Description);
                    param.Add("@SuccessfullyUpdated", direction: ParameterDirection.Output, size: 150);
                    var details = dbConnection.Query("SP_UpdateWorkLogHistory", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@SuccessfullyUpdated");

                    if (response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Updatation In UpdateWorkLogHistory Request Failed";

                    }

                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something Went wrong in UpdateWorkLogHistory repository with error :" + ex.Message;
            }
        }

        #endregion

        #region DeleteWorkLogEntry
        public void DeleteWorkLogEntry(DeleteWorkLogHistory deleteAttachmentParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@WorkLogHistoryId", deleteAttachmentParams.WorkLogHistoryId);
                    param.Add("@ProjectWorkId", deleteAttachmentParams.ProjectWorkId);
                    param.Add("@IsSuccessfullDeleted", direction: ParameterDirection.Output, size: 150);
                    dbConnection.Query("SP_DeleteWorkLogEntry", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@IsSuccessfullDeleted");
                    if (response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Cant delete WorkLog Currently..Please Try again after SomeTime!...";
                    }

                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in DeleteWorkLogEntry repository with error : " + ex.Message;
            }
        }


        #endregion


        #region GetHistoryTable
        public List<GetHistoryTableResponse> GetHistoryTable(GetHistoryTable filterParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            List<GetHistoryTableResponse> details = new List<GetHistoryTableResponse>();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@ProjectWorkId", filterParams.ProjectWorkId);
                    param.Add("@EmployeeId", filterParams.EmployeeId);
                    
                    param.Add("@PageNumber", filterParams.PageNumber);
                    param.Add("@PageSize", filterParams.PageSize);
                    param.Add("@SortColumn", filterParams.SortColumn);
                    param.Add("@SortOrder", filterParams.SortOrder);
                    param.Add("@HasHistoryRecords", direction: ParameterDirection.Output, size: 150);
                    param.Add("@TotalRecords", direction: ParameterDirection.Output, size: 150);
                    param.Add("@EmployeeName", direction: ParameterDirection.Output, size: 150);

                    details = dbConnection.Query<GetHistoryTableResponse>("SP_GetHistoryTable", param, commandType: CommandType.StoredProcedure).ToList();
                    var response = param.Get<string>("@HasHistoryRecords");
                    var totalRecords = param.Get<string>("@TotalRecords");
                    var employeeName = param.Get<string>("@EmployeeName");


                    if (response == "1")
                    {
                        details.ForEach(d => d.TotalRecords = totalRecords);
                        details.ForEach(d => d.EmployeeName = employeeName);


                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                        return details;
                    }

                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "No Records Found";

                    }
                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in GetHistoryTable repository with Error: " + ex.Message;
            }
            return details;
        }

        #endregion
    }
}
