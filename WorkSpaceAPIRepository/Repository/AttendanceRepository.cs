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
using WorkSpaceAPIEntites.ViewModels.AttendanceControllerViewModel;
using WorkSpaceAPIEntites.ViewModels.Common;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPIRepository.Repository
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly IConfiguration _configuration;
        public string? connectionString { get; private set; }
        public AttendanceRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            connectionString = configuration.GetConnectionString("user");
        }
        public IDbConnection Connection
        {
            get { return new SqlConnection(connectionString); }
        }
        #region GetAttendance
        public List<AttendanceResponse>? GetAttendance(SearchAttendancerequest searchAttendance, out HttpStatusCode? statusCode, out string? errorText)
        {
            List<AttendanceResponse>? attendance = new List<AttendanceResponse>();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@EmployeeId", searchAttendance.EmployeeId);
                    param.Add("@Month", searchAttendance.Month);
                    param.Add("@Year", searchAttendance.Year);
                    attendance = dbConnection.Query<AttendanceResponse>("SP_GetWithAttendance", param, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();
                    if (attendance == null)
                    {
                        statusCode = HttpStatusCode.Unauthorized;
                        errorText = "No data Found, Please try again!";
                        return null;
                    }
                    statusCode = HttpStatusCode.OK;
                    errorText = "Readed data successfully!";
                    return attendance;
                }
            }
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in GetAttendance repository with Error: " + ex.Message;
                return null;
            }
        }
        #endregion
        #region Add Or Update Attendance
        public void AddOrUpdateAttendance(AttendanceRequest attendanceRequest, out HttpStatusCode? statusCode, out string? errorText)
        {
            CommonResponseStatus responseStatus = new CommonResponseStatus();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@employeeId", attendanceRequest.EmployeeId);
                    param.Add("@attendanceOption", attendanceRequest.AttendanceOption);
                    param.Add("@status", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                    param.Add("@message", dbType: DbType.String, size: 255, direction: ParameterDirection.Output);
                    dbConnection.Query("SP_AddOrUpdateAttendance", param, commandType: CommandType.StoredProcedure);
                    responseStatus.Success = param.Get<bool>("@status");
                    responseStatus.Message = param.Get<string>("@message");
                    dbConnection.Close();
                    if (responseStatus.Success == false)
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
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in AttendanceInfoRepository repository with Error: " + ex.Message;
                return;
            }
        }
        #endregion

        #region ApproveAttendance
        public void ApproveAttendance(ApproveAttendanceRequest approveAttendanceRequest, out HttpStatusCode? statusCode, out string? errorText)
        {
            CommonResponseStatus responseStatus = new CommonResponseStatus();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@employeeId", approveAttendanceRequest.EmployeeId);
                    param.Add("@reportingPersonId", approveAttendanceRequest.ReportingPersonId);
                    param.Add("@attendanceDate", approveAttendanceRequest.AttendanceDate.Date);
                    param.Add("@isApproved", approveAttendanceRequest.isApproved);
                    param.Add("@status", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                    param.Add("@message", dbType: DbType.String, size: 255, direction: ParameterDirection.Output);
                    dbConnection.Query("SP_ApproveAttendance", param, commandType: CommandType.StoredProcedure);
                    responseStatus.Success = param.Get<bool>("@status");
                    responseStatus.Message = param.Get<string>("@message");
                    dbConnection.Close();
                    if (responseStatus.Success == false)
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
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in AttendanceInfoRepository repository with Error: " + ex.Message;
                return;
            }
        }

        #endregion

        #region GetHolidayList
        public List<GetHoliday>? GetHoliDayList(out HttpStatusCode? statusCode, out string? errorText)
        {
            List<GetHoliday> responce = new List<GetHoliday>();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    responce = dbConnection.Query<GetHoliday>("SP_GetHolidayList", commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();
                    if (responce == null)
                    {
                        statusCode = HttpStatusCode.NotFound;
                        errorText = "Holiday list not found.";
                        return null;
                    }
                    statusCode = HttpStatusCode.OK;
                    errorText = null;
                    return responce;
                }
            }
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in AttendanceInfoRepository repository with Error: " + ex.Message;
                return null;
            }
        }
        #endregion

    }
}
