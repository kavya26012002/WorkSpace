using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkSpaceAPIEntites.ViewModels.TimeSheetControllerViewModel;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPIRepository.Repository
{
    public class TimeSheetRepository : ITimeSheetRepository
    {
        private readonly IConfiguration _configuration;
        public string? connectionString { get; private set; }
        public TimeSheetRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            connectionString = configuration.GetConnectionString("user");
        }
        public IDbConnection Connection
        {
            get { return new SqlConnection(connectionString); }
        }


        #region GetTimeSheetDetail 
        public List<TimesheetDetailsViewModelResponse> GetTimeSheetDetail(GetTimeSheetDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        
        {
            List<TimesheetDetailsViewModelResponse> timesheetDetailsList = new List<TimesheetDetailsViewModelResponse>();

            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeId", searchParams.EmployeeId);
                    param.Add("@Month", searchParams.Month);
                    param.Add("@Year", searchParams.Year);
                    var results = dbConnection.Query<dynamic>("SP_GetMyTimesheet", param, commandType: CommandType.StoredProcedure).ToList();
                    List<KeyValuePair<string, object>> dateProperties = results.Count > 0
            ? ((IDictionary<string, object>)results[0])
                .Where(kvp => kvp.Key != "ProjectTitle" && kvp.Key != "P" && kvp.Key != "TotalWorkLog" && kvp.Key != "DailyTimeLogHours")
                .OrderBy(kvp => kvp.Key)
                .ToList() 
            : new List<KeyValuePair<string, object>>();
                    if (!results.Any(result => !string.IsNullOrEmpty(result.ProjectName)))
                    {
                        statusCode = HttpStatusCode.NoContent;
                        errorText = "No records found!....";
                        List<string> columnNames = dateProperties.Select(kvp => kvp.Key).ToList();
                        string dateValue = string.Join(" ", columnNames);

                        TimesheetDetailsViewModelResponse responseWithColumnNames = new TimesheetDetailsViewModelResponse
                        {
                            ColumnNames = columnNames,
                            ProjectName = null,
                            ProjectTitle = null,
                            P = null,
                            TotalWorkLog = null,
                            DateValues = new Dictionary<DateTime, decimal?>(),
                            DailyTimeLogHours = null
                        };

                        timesheetDetailsList.Add(responseWithColumnNames);
                    }

                    else
                    {
                       


                        foreach (var projectResult in results)
                        {
                            TimesheetDetailsViewModelResponse timesheetDetailsViewModelResponse = new TimesheetDetailsViewModelResponse();

                            IDictionary<string, object> resultDict = (IDictionary<string, object>)projectResult;

                            timesheetDetailsViewModelResponse.ProjectName = (string)resultDict["ProjectName"];

                            timesheetDetailsViewModelResponse.ProjectTitle = (string)resultDict["ProjectTitle"];
                            timesheetDetailsViewModelResponse.P = Convert.ToDecimal(resultDict["P"]);
                            timesheetDetailsViewModelResponse.TotalWorkLog = Convert.ToDecimal(resultDict["TotalWorkLog"]);
                            timesheetDetailsViewModelResponse.DailyTimeLogHours = Convert.ToDecimal(resultDict["DailyTimeLogHours"]);

                            timesheetDetailsViewModelResponse.DateValues = new Dictionary<DateTime, decimal?>();

                            foreach (var dateProperty in dateProperties)
                            {
                                if (DateTime.TryParseExact(dateProperty.Key, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
                                {
                                    var workTime = resultDict[dateProperty.Key] != null ? Convert.ToDecimal(resultDict[dateProperty.Key]) : (decimal?)null;
                                    timesheetDetailsViewModelResponse.DateValues[date] = workTime;
                                }
                            }

                            timesheetDetailsList.Add(timesheetDetailsViewModelResponse);
                        }
                    }



                    dbConnection.Close();

                        statusCode = HttpStatusCode.OK;
                        errorText = null;
                        return timesheetDetailsList;
                    
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

        #region GetTimeSheetAttendanceDetails
        public TimesheetAttendanceDetailsViewModelResponse GetTimeSheetAttendanceDetails(GetTimeSheetDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)

        {
            TimesheetAttendanceDetailsViewModelResponse timesheetAttendanceDetailsViewModelResponse = new TimesheetAttendanceDetailsViewModelResponse();

            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeId", searchParams.EmployeeId);
                    param.Add("@Month", searchParams.Month);
                    param.Add("@Year", searchParams.Year);
                    var details = dbConnection.QueryMultiple("SP_GetEmployeeLeaveDatesDynamic", param, commandType: CommandType.StoredProcedure);
                    timesheetAttendanceDetailsViewModelResponse.timesheetAttendanceTopDetailsViewModelResponse = details.Read<TimesheetAttendanceTopDetailsViewModelResponse>().ToList();
                    timesheetAttendanceDetailsViewModelResponse.timesheetAttendanceBottomDetailsViewModelResponse = details.Read<TimesheetAttendanceBottomDetailsViewModelResponse>().ToList();
                    timesheetAttendanceDetailsViewModelResponse.timesheetAttendanceHolidayListViewModelResponse = details.Read<TimesheetAttendanceHolidayListViewModelResponse>().ToList();

                    if (details != null)
                    {
                        statusCode = HttpStatusCode.OK;
                        errorText = null;
                        return timesheetAttendanceDetailsViewModelResponse;
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
            return timesheetAttendanceDetailsViewModelResponse;

        }



        #endregion

        #region GetTimeSheetDailyTimeLogEmployeeAndDate
        public List<GetTimeSheetDailyTimeLogEmployeeAndDateResponse> GetTimeSheetDailyTimeLogEmployeeAndDate(GetTimeSheetDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            List<GetTimeSheetDailyTimeLogEmployeeAndDateResponse> details = new List<GetTimeSheetDailyTimeLogEmployeeAndDateResponse>();
            {
                try
                {
                    using (IDbConnection dbConnection = Connection)
                    {
                        dbConnection.Open();
                        DynamicParameters param = new DynamicParameters();
                        param.Add("@EmployeeId", searchParams.EmployeeId);
                        param.Add("@Month", searchParams.Month);
                        param.Add("@Year", searchParams.Year);
                        details = dbConnection.Query<GetTimeSheetDailyTimeLogEmployeeAndDateResponse>("GetTimeSheetDailyTimeLogEmployeeAndDate", param, commandType: CommandType.StoredProcedure).ToList();
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

        #region GetTimeSheetDailyTimeLogggEmployeeAndDate
        public List<GetTimeSheetDailyTimeLogggEmployeeAndDateResponse> GetTimeSheetDailyTimeLogggEmployeeAndDate(GetTimeSheetDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            List<GetTimeSheetDailyTimeLogggEmployeeAndDateResponse> details = new List<GetTimeSheetDailyTimeLogggEmployeeAndDateResponse>();
            {
                try
                {
                    using (IDbConnection dbConnection = Connection)
                    {
                        dbConnection.Open();
                        DynamicParameters param = new DynamicParameters();
                        param.Add("@EmployeeId", searchParams.EmployeeId);
                        param.Add("@Month", searchParams.Month);
                        param.Add("@Year", searchParams.Year);
                        details = dbConnection.Query<GetTimeSheetDailyTimeLogggEmployeeAndDateResponse>("GetTimeSheetDailyTimeLOGGEmployeeAndDate", param, commandType: CommandType.StoredProcedure).ToList();
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

        #region GetTimeSheetHover
        public List<TimeSheetHoverViewModelResponse> GetTimeSheetHover(TimeSheetHoverViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText)
        {
            List<TimeSheetHoverViewModelResponse> details = new List<TimeSheetHoverViewModelResponse>();
            {
                try
                {
                    using (IDbConnection dbConnection = Connection)
                    {
                        dbConnection.Open();
                        DynamicParameters param = new DynamicParameters();
                        param.Add("@EmployeeId", searchParams.EmployeeId);
                        param.Add("@ProjectId", searchParams.ProjectId);
                        details = dbConnection.Query<TimeSheetHoverViewModelResponse>("SP_TimeSheetHover", param, commandType: CommandType.StoredProcedure).ToList();
                        
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
    }
}
