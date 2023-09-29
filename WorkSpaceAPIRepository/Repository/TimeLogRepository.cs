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
using WorkSpaceAPIEntites.ViewModels.TimeLogControllerViewModel;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPIRepository.Repository
{
    public class TimeLogRepository : ITimeLogRepository
    {
        private readonly IConfiguration _configuration;

        public string? connectionString { get; private set; }
        public TimeLogRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            connectionString = configuration.GetConnectionString("user");
        }
        public IDbConnection Connection
        {
            get { return new SqlConnection(connectionString); }
        }
        #region GetTimeLogDetail 
        public GetTimeLogDetailsViewModelResponse? GetTimeLogDetail(GetTimeLogDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
{
    GetTimeLogDetailsViewModelResponse getTimeLogDetailsViewModelResponse = new GetTimeLogDetailsViewModelResponse();

    try
    {
        using (IDbConnection dbConnection = Connection)
        {
            dbConnection.Open();
            DynamicParameters param = new DynamicParameters();
            param.Add("@EmployeeId", searchParams.EmployeeId);
            param.Add("@Month", searchParams.Month);
            param.Add("@Year", searchParams.Year);
            var details = dbConnection.QueryMultiple("SP_GetMyTimeLogsFinal", param, commandType: CommandType.StoredProcedure);
            
            try
            {
                // Attempt to read the data for both top and bottom parts
                getTimeLogDetailsViewModelResponse.getTimeLogDetailsTopPartViewModelResponse = details.ReadFirstOrDefault<GetTimeLogDetailsTopPartViewModelResponse>();
                getTimeLogDetailsViewModelResponse.getTimeLogDetailsBottomPartViewModelResponse = details.Read<GetTimeLogDetailsBottomPartViewModelResponse>().ToList();
            }
            catch (InvalidOperationException)
            {
                // No records found, set the appropriate message and status code
                statusCode = HttpStatusCode.OK;
                errorText = "No Data Found, Please try again!..";
                return null;
            }
            
            dbConnection.Close();

            statusCode = HttpStatusCode.OK;
            errorText = null;
            return getTimeLogDetailsViewModelResponse;
        }
    }
    catch (Exception ex)
    {
        statusCode = HttpStatusCode.InternalServerError;
        errorText = "Something went wrong in GetTimeLogDetail repository with Error: " + ex.Message;
        return null;
    }
}

        #endregion

        #region GetTimeLogYearly

        public List<GetTimeLogYearlyResponse> GetTimeLogYearly(GetTimeLogYearlyRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            List<GetTimeLogYearlyResponse> details = new List<GetTimeLogYearlyResponse>();
            
                try
                {
                    using(IDbConnection dbConnection = Connection)
                    {
                        dbConnection.Open();
                        DynamicParameters param = new DynamicParameters();
                        param.Add("@EmployeeId", searchParams.EmployeeId);
                        param.Add("@Year", searchParams.Year);
                        details = dbConnection.Query<GetTimeLogYearlyResponse>("SP_GetTimeLogYearly", param, commandType: CommandType.StoredProcedure).ToList();
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
                    errorText = "Something went wrong in GetTimeLogYearly repository with Error: " + ex.Message;
                }
                return details;
            
        }

        #endregion

        #region GetTimeLogMonthlyHover
        public List<HoverTimeLogMonthlyResponse> GetTimeLogMonthlyHover(HoverTimeLogMonthlyRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            List<HoverTimeLogMonthlyResponse> details = new List<HoverTimeLogMonthlyResponse>();
            {
                try
                {
                    using (IDbConnection dbConnection = Connection)
                    {
                        dbConnection.Open();
                        DynamicParameters param = new DynamicParameters();
                        param.Add("@EmployeeId", searchParams.EmployeeId);
                        param.Add("@LogDate", searchParams.LogDate);
                        param.Add("@Month", searchParams.Month);
                        param.Add("@Year", searchParams.Year);
                        details = dbConnection.Query<HoverTimeLogMonthlyResponse>("SP_HoverTimeLogMonthly", param, commandType: CommandType.StoredProcedure).ToList();

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
                    errorText = "Something went wrong in GetTimeLogMonthlyHover repository with Error: " + ex.Message;
                    return null;
                }
                return details;

            }
        }

        #endregion
    }
}
