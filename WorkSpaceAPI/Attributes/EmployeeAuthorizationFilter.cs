using System;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace WorkSpaceAPI.Attributes
{
    public class EmployeeAuthorizationFilter : IAuthorizationFilter
    {
        private readonly IConfiguration _configuration;
        public string? connectingString { get; private set; }
        public EmployeeAuthorizationFilter(IConfiguration configuration)
        {
            _configuration = configuration;
            connectingString = configuration.GetConnectionString("user");
        }
        public IDbConnection Connection { get { return new SqlConnection(connectingString); } }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            // Check if the employee is authenticated
            if (context.HttpContext.User.Identity != null && !context.HttpContext.User.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // Check if user is exist
            var userIdClaim = context.HttpContext.User.FindFirst("userId")?.Value ?? "0";
            bool isUserExist = false;
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                DynamicParameters param = new DynamicParameters();
                param.Add("@userId", userIdClaim);
                param.Add("@status", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                dbConnection.Execute("SP_IsEmployeeExist", param, commandType: CommandType.StoredProcedure);
                isUserExist = param.Get<bool>("@status");
                dbConnection.Close();
            }

            // Check Ip
            var ipAddressClaim = context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "IpAddress")?.Value;
            var remoteIpAddress = context.HttpContext.Connection.RemoteIpAddress?.ToString();

            // Check Browser/User-Agent
            var userAgentClaim = context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "UserAgent")?.Value;
            var userAgent = context.HttpContext.Request.Headers["User-Agent"].FirstOrDefault();

            if (ipAddressClaim != remoteIpAddress && userAgentClaim != userAgent && isUserExist == false)
            {
                context.Result = new ForbidResult();
                return;
            }
        }
    }
}