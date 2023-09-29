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
using WorkSpaceAPIEntites.ViewModels.ServiceRequestControllerViewModel;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPIRepository.Repository
{
    public class ServiceRequestRepository : IServiceRequestRepository
    {
        private readonly IConfiguration _configuration;

        public string? connectionString { get; private set; }
        public ServiceRequestRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            connectionString = configuration.GetConnectionString("user");
        }
        public IDbConnection Connection
        {
            get { return new SqlConnection(connectionString); }
        }
        #region To get ServiceRequestList & filters
        public List<GetServiceResponseDetailsViewModel> GetServiceRequest(GetServiceRequestDetailsViewModel filterParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            List<GetServiceResponseDetailsViewModel> details = new List<GetServiceResponseDetailsViewModel>();
            {
                try
                {
                    using (IDbConnection dbConnection = Connection)
                    {
                        dbConnection.Open();
                        DynamicParameters param = new DynamicParameters();
                        param.Add("@EmployeeId", filterParams.EmployeeId);
                        param.Add("@TicketNumber", filterParams.TicketNumber);
                        param.Add("@RequestStatus", filterParams.RequestStatus);
                        param.Add("@PageNumber", filterParams.PageNumber);
                        param.Add("@PageSize", filterParams.PageSize);
                        param.Add("@SortColumn", filterParams.SortColumn);
                        param.Add("@SortOrder", filterParams.SortOrder);
                        param.Add("@HasServiceRequests", direction: ParameterDirection.Output, size: 150);
                        param.Add("@TotalRecords", direction: ParameterDirection.Output, size: 150);
                        details = dbConnection.Query<GetServiceResponseDetailsViewModel>("SP_GetServiceDetailsForEmployee", param, commandType: CommandType.StoredProcedure).ToList();
                        var response = param.Get<string>("@HasServiceRequests");
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
        }
        #endregion

        #region Add Service Request
        public void AddServiceRequest(InsertServiceRequestViewModelRequest addServiceRequestParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeId", addServiceRequestParams.EmployeeId);
                    param.Add("@ServiceGroupId", addServiceRequestParams.ServiceGroupId);
                    param.Add("@CategoryId", addServiceRequestParams.CategoryId);
                    param.Add("@SubCategoryId", addServiceRequestParams.SubCategoryId);
                    param.Add("@ServiceRequestPriority", addServiceRequestParams.ServiceRequestPriority);
                    param.Add("@ServiceDetails", addServiceRequestParams.ServiceDetails);
                    param.Add("@IsInsertSuccessful", direction: ParameterDirection.Output, size: 150);
                    dbConnection.Query("SP_CreateServiceRequest", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@IsInsertSuccessful");
                    if (response == "1")
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
                errorText = "Something went wrong in AddServiceRequest repository with error : " + ex.Message;
            }
        }

        #endregion

        #region GetServiceDetails Employee Insert details with Filling dropDown
        public GetServiceRequestInsertDetailsDropDownViewModelResponse? GetServiceDetailswithfillingDropdown(GetServiceRequestInsertDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            GetServiceRequestInsertDetailsDropDownViewModelResponse getServiceRequestInsertDetailsDropDownViewModelResponse = new GetServiceRequestInsertDetailsDropDownViewModelResponse();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeId", searchParams.EmployeeId);
                    var details = dbConnection.QueryMultiple("SP_GetServiceRequestInsertDetails", param, commandType: CommandType.StoredProcedure);
                    getServiceRequestInsertDetailsDropDownViewModelResponse.getServiceRequestInsertDetailsViewModelResponse = details.ReadFirst<GetServiceRequestInsertDetailsViewModelResponse>();
                    getServiceRequestInsertDetailsDropDownViewModelResponse.serviceGroupList = details.Read<GetDropdownDetailResponseModel>().ToList();
                    getServiceRequestInsertDetailsDropDownViewModelResponse.categoryList = details.Read<GetDropdownDetailResponseModel>().ToList();
                    getServiceRequestInsertDetailsDropDownViewModelResponse.subCategoryList = details.Read<GetDropdownDetailResponseModel>().ToList();
                    dbConnection.Close();
                    if (details == null)
                    {
                        statusCode = HttpStatusCode.Unauthorized;
                        errorText = "No data Found, Please try again!";
                        return null;
                    }
                    statusCode = HttpStatusCode.OK;
                    errorText = "Readed data successfully!";
                    return getServiceRequestInsertDetailsDropDownViewModelResponse;
                }
            }
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in GetServiceDetailswithfillingDropdown repository with Error: " + ex.Message;
                return null;
            }
        }

        #endregion

        #region UpdateServiceRequest
        public UpdateServiceRequestViewModelResponse UpdateServiceRequest(UpdateServiceRequestViewModelRequest updateServiceRequestParams, out HttpStatusCode StatusCode, out string? errorText)
        {
            UpdateServiceRequestViewModelResponse details = new UpdateServiceRequestViewModelResponse();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@ServiceRequestId", updateServiceRequestParams.ServiceRequestId);
                    param.Add("@RequestedDate", updateServiceRequestParams.RequestedDate);
                    param.Add("@Status", updateServiceRequestParams.Status);
                    param.Add("@ServiceGroupId", updateServiceRequestParams.ServiceGroupId);
                    param.Add("@CategoryId", updateServiceRequestParams.CategoryId);
                    param.Add("@SubCategoryId", updateServiceRequestParams.SubCategoryId);
                    param.Add("@ServiceDetails", updateServiceRequestParams.ServiceDetails);
                    param.Add("@ServiceRequestPriority", updateServiceRequestParams.ServiceRequestPriority);
                    param.Add("@Comments", updateServiceRequestParams.Comments);
                    param.Add("@IsUpdateSuccessful", direction: ParameterDirection.Output, size: 150);
                    details = dbConnection.QuerySingleOrDefault<UpdateServiceRequestViewModelResponse>("SP_UpdateServiceRequest", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@IsUpdateSuccessful");
                    if (response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                        return details;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Updatation In Closed Status Cant happen";

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

        #region CategoryDropdown
        public List<GetServiceCategoryDropdownViewModelResponse> GetCategoryDropdown(GetServiceCategoryDropdownViewModelRequest serachParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            List<GetServiceCategoryDropdownViewModelResponse> details = new List<GetServiceCategoryDropdownViewModelResponse>();
            {
                try
                {
                    using (IDbConnection dbConnection = Connection)
                    {
                        dbConnection.Open();
                        DynamicParameters param = new DynamicParameters();
                        param.Add("@InputServiceGroupId", serachParams.InputServiceGroupId);
                        details = dbConnection.Query<GetServiceCategoryDropdownViewModelResponse>("SP_GetCategoriesDropdownByServiceGroupId", param, commandType: CommandType.StoredProcedure).ToList();
                        if (details != null)
                        {
                            StatusCode = HttpStatusCode.OK;
                            errorText = null;
                            return details;
                        }
                        else
                        {
                            StatusCode = HttpStatusCode.NotFound;
                            errorText = "No records found";
                        }
                    }
                }
                catch (Exception ex)

                {
                    StatusCode = HttpStatusCode.InternalServerError;
                    errorText = "Something went wrong in GetCategoryDropdown repository with Error: " + ex.Message;
                }
                return details;
            }
        }

        #endregion

        #region SubCategoryDropdown
        public List<GetServiceSubCategoryDropdownViewModelResponse> GetSubCategoryDropdown(GetServiceSubCategoryDropdownViewModelRequest serachParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            List<GetServiceSubCategoryDropdownViewModelResponse> details = new List<GetServiceSubCategoryDropdownViewModelResponse>();
            {
                try
                {
                    using (IDbConnection dbConnection = Connection)
                    {
                        dbConnection.Open();
                        DynamicParameters param = new DynamicParameters();
                        param.Add("@InputCategoryId", serachParams.InputCategoryId);
                        details = dbConnection.Query<GetServiceSubCategoryDropdownViewModelResponse>("SP_GetSubCategoriesByServiceGroupId", param, commandType: CommandType.StoredProcedure).ToList();
                        if (details != null)
                        {
                            StatusCode = HttpStatusCode.OK;
                            errorText = null;
                            return details;
                        }
                        else
                        {
                            StatusCode = HttpStatusCode.NotFound;
                            errorText = "No records found";
                        }
                    }
                }
                catch (Exception ex)

                {
                    StatusCode = HttpStatusCode.InternalServerError;
                    errorText = "Something went wrong in GetSubCategoryDropdown repository with Error: " + ex.Message;
                }
                return details;
            }
        }

        #endregion

        #region UpdateServiceRequestDetails
        public List<GetUpdateServiceDetailsViewModelResponse> UpdateServiceRequestDetails(GetUpdateServiceDetailsViewModelRequest serachParams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            List<GetUpdateServiceDetailsViewModelResponse> details = new List<GetUpdateServiceDetailsViewModelResponse>();
            {
                try
                {
                    using (IDbConnection dbConnection = Connection)
                    {
                        dbConnection.Open();
                        DynamicParameters param = new DynamicParameters();
                        param.Add("@ServiceRequestId", serachParams.ServiceRequestId);
                        details = dbConnection.Query<GetUpdateServiceDetailsViewModelResponse>("SP_GetUpdateDetails", param, commandType: CommandType.StoredProcedure).ToList();
                        if (details != null)
                        {
                            StatusCode = HttpStatusCode.OK;
                            errorText = null;
                            return details;
                        }
                        else
                        {
                            StatusCode = HttpStatusCode.NotFound;
                            errorText = "No records found";
                        }
                    }
                }
                catch (Exception ex)

                {
                    StatusCode = HttpStatusCode.InternalServerError;
                    errorText = "Something went wrong in UpdateServiceRequestDetails repository with Error: " + ex.Message;
                }
                return details;
            }
        }

        #endregion

       #region GetUpdateServiceRequestCategoryDropdownEmployeeDetails
        public UpdateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse? GetUpdateServiceRequestCategoryDropdownEmployeeDetails(GetUpdateCategoryDropdown searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            UpdateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse updateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse = new UpdateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse();

            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@InputServiceGroupId", searchParams.InputServiceGroupId);
                    param.Add("@ServiceRequestId", searchParams.ServiceRequestId);
                    var details = dbConnection.QueryMultiple("SP_GetUpdateCategoriesByServiceGroupId", param, commandType: CommandType.StoredProcedure);
                    updateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse.getUpdateServiceRequestCategoryDropdownTopViewModelResponse = details.Read<GetUpdateServiceRequestCategoryDropdownTopViewModelResponse>().ToList();
                    updateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse.getUpdateServiceRequestCategoryDropdownBottomViewModelResponse = details.Read<GetUpdateServiceRequestCategoryDropdownBottomViewModelResponse>().ToList();

                    if (details != null)
                    {
                        statusCode = HttpStatusCode.OK;
                        errorText = null;
                        return updateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse;
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
            return updateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse;

        }

        #endregion

       #region GetUpdateServiceRequestSubCategoryDropdownEmployeeDetails
        public UpdateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse? GetUpdateServiceRequestSubCategoryDropdownEmployeeDetails(GetUpdateSubCategoryDropdown searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            UpdateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse updateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse = new UpdateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse();

            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@InputCategoryId", searchParams.InputCategoryId);
                    param.Add("@ServiceRequestId", searchParams.ServiceRequestId);
                    var details = dbConnection.QueryMultiple("SP_GetUpdateSubCategoriesByServiceGroupId", param, commandType: CommandType.StoredProcedure);
                    updateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse.getUpdateServiceRequestSubCategoryDropdownTopViewModelResponse = details.Read<GetUpdateServiceRequestSubCategoryDropdownTopViewModelResponse>().ToList();
                    updateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse.getUpdateServiceRequestSubCategoryDropdownBottomViewModelResponse = details.Read<GetUpdateServiceRequestSubCategoryDropdownBottomViewModelResponse>().ToList();

                    if (details != null)
                    {
                        statusCode = HttpStatusCode.OK;
                        errorText = null;
                        return updateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse;
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
            return updateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse;

        }

        #endregion

        #region ChangeServiceRequestStatus

        public void ChangeServiceRequest(changeServiceRequestStatusViewModelRequest searchparams, out HttpStatusCode? StatusCode, out string? errorText)
        {
            try
            {
                using(IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@employeeId", searchparams.employeeId);
                    param.Add("@RequestStatus", searchparams.RequestStatus);
                    param.Add("@ServiceRequestId", searchparams.ServicerequestId);
                    param.Add("@Comments", searchparams.Comments);
                    param.Add("@Output", direction: ParameterDirection.Output, size: 150);
                    dbConnection.Query("SP_ChangeRequestStatus", param, commandType: CommandType.StoredProcedure);
                    var response = param.Get<string>("@Output");
                    if(response == "1")
                    {
                        StatusCode = HttpStatusCode.OK;
                        errorText = null;
                    }
                    else
                    {
                        StatusCode = HttpStatusCode.NotFound;
                        errorText = "Cant Change Status of service request";
                    }



                }
            }
            catch (Exception ex)
            {
                StatusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in ChangeServiceRequest repository with error : " + ex.Message;
            }
        }


        #endregion
    }
}




