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
using WorkSpaceAPIEntites.ViewModels.LeaveRequestControllerViewModel;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPIRepository.Repository
{
    public class LeaveRequestRepository : ILeaveRequestRepository
    {
        private readonly IConfiguration _configuration;

        public string? connectionString { get; private set; }
    public LeaveRequestRepository(IConfiguration configuration)
    {
            _configuration = configuration;
            connectionString = configuration.GetConnectionString("user");
    }
    public IDbConnection Connection
    {
            get { return new SqlConnection(connectionString); }
    }

        #region To get LeaveRequestList & filters
        public List<GetLeaveResponseDetailsViewModel> GetLeaveRequest(GetLeaveRequestDetailsViewModel filterParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            List<GetLeaveResponseDetailsViewModel> details = new List<GetLeaveResponseDetailsViewModel>();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeId", filterParams.EmployeeId);
                    param.Add("@LeaveStartDate", filterParams.LeaveStartDate);
                    param.Add("@LeaveEndDate", filterParams.LeaveEndDate);
                    param.Add("@LeaveRequestStatus", filterParams.LeaveRequestStatus);
                    param.Add("@PageNumber", filterParams.PageNumber);
                    param.Add("@PageSize", filterParams.PageSize);
                    param.Add("@SortColumn", filterParams.SortColumn);
                    param.Add("@SortOrder", filterParams.SortOrder);
                    param.Add("@HasLeaveRequests", direction: ParameterDirection.Output, size: 150);
                    param.Add("@TotalRecords", direction: ParameterDirection.Output,  size:150); 

                    details = dbConnection.Query<GetLeaveResponseDetailsViewModel>("GetLeaveRequestDetails", param, commandType: CommandType.StoredProcedure).ToList();
                    var response = param.Get<string>("@HasLeaveRequests");
                    var totalRecords = param.Get<string>("@TotalRecords");


                    if (response == "1")
                    {
                        details.ForEach(d => d.TotalRecords = totalRecords);
                       

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

        #region Add Leave Request
        public void AddLeaveRequest(InsertLeaveRequestViewModelRequest addLeaveRequestParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeId", addLeaveRequestParams.EmployeeId);
                    param.Add("@ReportingPersonId", addLeaveRequestParams.ReportingPersonId);
                    param.Add("@ReasonForLeave", addLeaveRequestParams.ReasonForLeave);
                    param.Add("@LeaveStartDate", addLeaveRequestParams.LeaveStartDate);
                    param.Add("@LeaveEndDate", addLeaveRequestParams.LeaveEndDate);
                    param.Add("@StartDateAttendanceOption", addLeaveRequestParams.StartDateAttendanceOption);
                    param.Add("@EndDateAttendanceOption", addLeaveRequestParams.EndDateAttendanceOption);
                    param.Add("@IsAdhocLeave", addLeaveRequestParams.IsAdhocLeave);
                    param.Add("@AdhocLeaveStatus", addLeaveRequestParams.AdhocLeaveStatus);
                    param.Add("@PhoneNumber", addLeaveRequestParams.PhoneNumber);
                    param.Add("@AlternatePhoneNumber", addLeaveRequestParams.AlternatePhoneNumber);
                    param.Add("@AvailibiltyOnPhone", addLeaveRequestParams.AvailibiltyOnPhone);
                    param.Add("@AvailibiltyInCity", addLeaveRequestParams.AvailibiltyInCity);
                    param.Add("@InserstSuccess", direction: ParameterDirection.Output, size: 150);
                    dbConnection.Query("InsertLeaveRequest", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@InserstSuccess");
                    if(response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Cant Add Leave Request";
                    }
                   
                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in AddLeaveRequest repository with error : " + ex.Message;
            }
        }

        #endregion

        #region GetEmployeeName,ReportingPersonName,PhoneNumber Details
        public List<GetEmployeeDetailsViewModelResponse> GetEmployeeDetails(GetEmployeeDetailsViewModelRequest getEmployeeDetailsParams, out HttpStatusCode StatusCode, out string? errorText)
        {
            List<GetEmployeeDetailsViewModelResponse> details = new List<GetEmployeeDetailsViewModelResponse>();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeId", getEmployeeDetailsParams.EmployeeId);
                    param.Add("@StartDate", getEmployeeDetailsParams.StartDate);
                    param.Add("@EndDate", getEmployeeDetailsParams.EndDate);
                    param.Add("@EmployeeExists", direction: ParameterDirection.Output, size: 150);
                    details = dbConnection.Query<GetEmployeeDetailsViewModelResponse>("GetEmployeeInfo", param, commandType: CommandType.StoredProcedure).ToList();

                    var response = param.Get<string>("@EmployeeExists");
                    if(response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                        return details;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "EmployeeDetails with this EmployeeId is not present";

                    }

                }
            }
            catch(Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something Went wrong in GetEmployeeDetails repository with error :" + ex.Message;
            }
            return details;
        }

        #endregion

        #region UpdateLeaveRequest
        public UpdateLeaveRequestViewModelResponse UpdateLeaveRequest(UpdateLeaveRequestViewModelRequest updateLeaveRequestParams, out HttpStatusCode StatusCode, out string? errorText)
        {
            UpdateLeaveRequestViewModelResponse details = new UpdateLeaveRequestViewModelResponse();
            try
            {
                using(IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@LeaveRequestId", updateLeaveRequestParams.LeaveRequestId);
                    param.Add("@ReasonForLeave", updateLeaveRequestParams.ReasonForLeave);
                    param.Add("@LeaveStartDate", updateLeaveRequestParams.LeaveStartDate);
                    param.Add("@LeaveEndDate", updateLeaveRequestParams.LeaveEndDate);
                    param.Add("@StartDateAttendanceOption", updateLeaveRequestParams.StartDateAttendanceOption);
                    param.Add("@EndDateAttendanceOption", updateLeaveRequestParams.EndDateAttendanceOption);
                    param.Add("@IsAdhocLeave", updateLeaveRequestParams.IsAdhocLeave);
                    param.Add("@AdhocLeaveStatus", updateLeaveRequestParams.AdhocLeaveStatus);
                    param.Add("@PhoneNumber", updateLeaveRequestParams.PhoneNumber);
                    param.Add("@AlternatePhoneNumber", updateLeaveRequestParams.AlternatePhoneNumber);
                    param.Add("@AvailibiltyOnPhone", updateLeaveRequestParams.AvailibiltyOnPhone);
                    param.Add("@AvailibiltyInCity", updateLeaveRequestParams.AvailibiltyInCity);
                    param.Add("@Success", direction: ParameterDirection.Output, size: 150);
                    details = dbConnection.QuerySingleOrDefault<UpdateLeaveRequestViewModelResponse>("UpdateLeaveRequest", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@Success");
                    if(response == "StartDate cannot be greater than EndDate")
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "StartDate cannot be greater than EndDate";
                    }
                    else if(response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                        return details;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Updatation In Leave Request Failed";

                    }

                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something Went wrong in UpdateLeaveRequest repository with error :" + ex.Message;
            }
            return details;
        }

        #endregion

        #region GetUpdateLeaveRequestEmployeeDetails
        public UpdateGetEmployeeDetailsModelResponse? GetUpdateEmployeeDetail(GetUpdateLeaveRequestViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            UpdateGetEmployeeDetailsModelResponse updateGetEmployeeDetailsModelResponse = new UpdateGetEmployeeDetailsModelResponse();

            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@LeaveRequestId", searchParams.LeaveRequestId);
                    param.Add("@LeaveRequestIdExists", direction: ParameterDirection.Output, size: 150);
                    var details = dbConnection.QueryMultiple("GetUpdateLeaveRequestDetails", param, commandType: CommandType.StoredProcedure);
                    updateGetEmployeeDetailsModelResponse.getUpdateLeaveRequestTopViewModelResponse = details.Read<GetUpdateLeaveRequestTopViewModelResponse>().ToList();
                    updateGetEmployeeDetailsModelResponse.getUpdateLeaveRequestBottomViewModelResponse = details.Read<GetUpdateLeaveRequestBottomViewModelResponse>().ToList();

                    var response = param.Get<string>("@LeaveRequestIdExists");
                    if (response =="1")
                    {
                        statusCode = HttpStatusCode.OK;
                        errorText = null;
                        return updateGetEmployeeDetailsModelResponse;
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
            return updateGetEmployeeDetailsModelResponse;

        }

        #endregion

        #region Delete Leave Request
        public void DeleteLeaveRequest(DeleteLeaveRequestViewModelRequest deleteLeaveRequestParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeId", deleteLeaveRequestParams.EmployeeId);
                    param.Add("@LeaveRequestId", deleteLeaveRequestParams.LeaveRequestId);
                    param.Add("@IsDeleted", direction: ParameterDirection.Output, size: 150);

                    dbConnection.Query("SP_DeleteLeaveRequest", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@IsDeleted");
                    if (response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Cant delete Leave Request";
                    }

                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in DeleteLeaveRequest repository with error : " + ex.Message;
            }
        }

        #endregion

    }

}
