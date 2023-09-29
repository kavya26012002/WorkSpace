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
using WorkSpaceAPIEntites.ViewModels.WorkItemControllerViewModel;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPIRepository.Repository
{
    public class WorkItemRepository: IWorkItemRepository
    {
        private readonly IConfiguration _configuration;

        public string? connectionString { get; private set; }
        public WorkItemRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            connectionString = configuration.GetConnectionString("user");
        }
        public IDbConnection Connection
        {
            get { return new SqlConnection(connectionString); }
        }
        #region To get GetWorkItemsList & filters
        public List<GetWorkItemDetailsViewModelResponse> GetWorkItemsList(GetWorkItemDetailsViewModelRequest filterParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            List<GetWorkItemDetailsViewModelResponse> details = new List<GetWorkItemDetailsViewModelResponse>();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeId", filterParams.EmployeeId);
                    param.Add("@ProjectName", filterParams.ProjectName);
                    details = dbConnection.Query<GetWorkItemDetailsViewModelResponse>("SP_GetWorkItemDetails", param, commandType: CommandType.StoredProcedure).ToList();
                   
                    if (details != null)
                    {
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
                errorText = "Something went wrong in GetLeaveRequest repository with Error: " + ex.Message;
            }
            return details;
        }

        #endregion

        #region ReportingPersonName
        public List<GetEmployeeDetailsForInsertingWorkItemViewModelResponse> GetAllEmployeeName(GetEmployeeDetailsForInsertingWorkItemViewModelRequest getEmployeeDetailsParams, out HttpStatusCode StatusCode, out string? errorText)
        {
            List<GetEmployeeDetailsForInsertingWorkItemViewModelResponse> details = new List<GetEmployeeDetailsForInsertingWorkItemViewModelResponse>();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeId", getEmployeeDetailsParams.EmployeeId);
                    param.Add("@EmployeeExists", direction: ParameterDirection.Output, size: 150);

                    details = dbConnection.Query<GetEmployeeDetailsForInsertingWorkItemViewModelResponse>("SP_GetEmployeeListInWorkItems", param, commandType: CommandType.StoredProcedure).ToList();
                    var response = param.Get<string>("@EmployeeExists");
                    if (response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                        return details;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "ReportingPerson Name  with this EmployeeId is not present";

                    }

                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something Went wrong in GetAllEmployeeName repository with error :" + ex.Message;
            }
            return details;
        }

        #endregion

        #region AddWorkItem
        public void AddWorkItemRequest(InsertWorkItemViewModelRequest addWorkItemRequestParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@ProjectId", addWorkItemRequestParams.ProjectId);
                    param.Add("@EmployeeId", addWorkItemRequestParams.EmployeeId);
                    param.Add("@SubProjectID", addWorkItemRequestParams.SubProjectId);
                    param.Add("@Title", addWorkItemRequestParams.Title);
                    param.Add("@WorkGroupId", addWorkItemRequestParams.WorkGroupId);
                    param.Add("@WorkFlow", addWorkItemRequestParams.WorkFlow);
                    param.Add("@ProjectWorkItemsPriority", addWorkItemRequestParams.ProjectWorkItemsPriority);
                    param.Add("@ProjectStatusId", addWorkItemRequestParams.ProjectStatusId);
                    param.Add("@StartDate", addWorkItemRequestParams.StartDate);
                    param.Add("@EndDate", addWorkItemRequestParams.EndDate);
                    param.Add("@OriginalEstTime", addWorkItemRequestParams.OriginalEstTime);
                    param.Add("@AssignedEmployeeId", addWorkItemRequestParams.AssignedEmployeeId);
                    param.Add("@ReportingEmployeeId", addWorkItemRequestParams.ReportingEmployeeId);
                    param.Add("@ReleasedToProduction", addWorkItemRequestParams.ReleasedToProduction);
                    param.Add("@Description", addWorkItemRequestParams.Description);
                    param.Add("@IsInsertSuccessful", direction: ParameterDirection.Output, size: 150);
                    dbConnection.Query("SP_CreateWorkItems", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@IsInsertSuccessful");
                    if (response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Cant Add WorkItem Request";
                    }

                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in AddWorkItemRequest repository with error : " + ex.Message;
            }
        }
        #endregion

        #region UpdateWorkItem (Add WorkLog)
        public UpdateWorkItemViewModelResponse UpdateWorkItem(UpdateWorkItemViewModelRequest updateWorkItemsParams, out HttpStatusCode StatusCode, out string? errorText)
        {
            UpdateWorkItemViewModelResponse details = new UpdateWorkItemViewModelResponse();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeID", updateWorkItemsParams.EmployeeId);
                    param.Add("@ProjectWorkId", updateWorkItemsParams.ProjectWorkId);
                    param.Add("@WorkDoneOn", updateWorkItemsParams.WorkDoneOn);
                    param.Add("@WorkTime", updateWorkItemsParams.WorkTime);
                    param.Add("@Description", updateWorkItemsParams.Description);
                    //param.Add("@Remaining", updateWorkItemsParams.Remaining);
                    
                    param.Add("@IsUpdateSuccessful", direction: ParameterDirection.Output, size: 150);
                    details = dbConnection.QuerySingleOrDefault<UpdateWorkItemViewModelResponse>("SP_UpdateWorkItemDetails", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@IsUpdateSuccessful");
                    if (response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                        return details;
                    }
                    else if(response == "2")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                        return details;
                    }
                    
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Updatation In Work Item  Failed";

                    }

                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something Went wrong in UpdateWorkItem repository with error :" + ex.Message;
            }
            return details;
        }

        #endregion

        #region GetUpdateWorkItemDetails
        public GetUpdateWorkItemsViewModelResponse GetUpdateWorkItemDetails(GetUpdateWorkItemsViewModelRequest getworkitemsRequestParams, out HttpStatusCode StatusCode, out string? errorText)
        {
            GetUpdateWorkItemsViewModelResponse details = new GetUpdateWorkItemsViewModelResponse();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@ProjectWorkId", getworkitemsRequestParams.ProjectWorkId);
                    param.Add("@IsExists", direction: ParameterDirection.Output, size: 150);
                    details = dbConnection.QuerySingleOrDefault<GetUpdateWorkItemsViewModelResponse>("SP_GETUpdateWorkItemDetails", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@IsExists");
                    if (response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                        return details;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "WorkItem Details of this employee is not present";

                    }
                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something Went wrong in GetUpdateWorkItemDetails repository with error :" + ex.Message;
            }
            return details;

        }

        #endregion
    }
}
