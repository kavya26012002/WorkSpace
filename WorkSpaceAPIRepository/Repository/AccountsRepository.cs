using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkSpaceAPIRepository.Interface;
using WorkSpaceAPIEntites.ViewModels.AccountControllerViewModel;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using System.Data;
using System.Data.SqlClient;
using WorkSpaceAPIEntites.ViewModels.Common;
using Dapper;

namespace WorkSpaceAPIRepository.Repository
{
    public class AccountsRepository : IAccountsRepository
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public string? connectionString { get; private set; }
        public AccountsRepository(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            connectionString = configuration.GetConnectionString("user");
            _httpContextAccessor = httpContextAccessor;
        }
        public IDbConnection Connection
        {
            get { return new SqlConnection(connectionString); }
        }
        public Tokens? Authenticate(LoginRequest loginRequest, out HttpStatusCode? statusCode, out string? errorText)
        {
            LoginResponseStatus responseStatus = new LoginResponseStatus();
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    DynamicParameters param = new DynamicParameters();
                    param.Add("@userName", loginRequest.userName);
                    param.Add("@password", loginRequest.password);
                    param.Add("@employeeId", dbType: DbType.Int64, direction: ParameterDirection.Output);
                    param.Add("@status", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                    param.Add("@message", dbType: DbType.String, size: 255, direction: ParameterDirection.Output);
                    dbConnection.Query("SP_Login", param, commandType: CommandType.StoredProcedure);
                    responseStatus.EmployeeId = param.Get<Int64?>("@employeeId");
                    responseStatus.Success = param.Get<bool>("@status");
                    responseStatus.Message = param.Get<string>("@message");
                    dbConnection.Close();
                    if (responseStatus.Success == false)
                    {
                        statusCode = HttpStatusCode.Unauthorized;
                        errorText = responseStatus.Message;
                        return null;
                    }

                    var accessToken = GenrateAccessToken(loginRequest.userName, responseStatus.EmployeeId.ToString() ?? String.Empty);

                    // Generate refresh token
                    var refreshToken = GenerateRefreshToken();

                    // Set the refresh token expiry time
                    var refreshTokenExpiryTime = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JWT:RefershTokenExpiresTime"]));

                    // Token expiry time
                    var tokenExpiryTime = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JWT:ExpiresTime"]));

                    // Encrypt and store necessary claims and information in the refresh token
                    var encryptedRefreshToken = EncryptRefreshToken(refreshToken, refreshTokenExpiryTime, loginRequest.userName, responseStatus.EmployeeId.ToString() ?? String.Empty);

                    statusCode = HttpStatusCode.OK;
                    errorText = responseStatus.Message;
                    return new Tokens { Token = accessToken, EmployeeId = responseStatus.EmployeeId, RefreshToken = encryptedRefreshToken, TokenExpiryTime = tokenExpiryTime, RefreshTokenExpiryTime = refreshTokenExpiryTime };
                }
            }
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong in AccountsRepository repository with Error: " + ex.Message;
                return null;
            }
        }
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
        private string EncryptRefreshToken(string refreshToken, DateTime refershExpiryTime, string username, string userId)
        {
            var tokenData = new Dictionary<string, string>()
            {
                { "refreshToken", refreshToken },
                { "userId", userId },
                { "username", username },
                { "refershExpiryTime", refershExpiryTime.ToString() }
                // Add any other necessary claims or information
            };

            var tokenDataJson = JsonConvert.SerializeObject(tokenData);

            using (var aes = Aes.Create())
            {
                aes.Key = Convert.FromBase64String(_configuration["JWT:EncryptionKey"] ?? String.Empty);
                aes.IV = Convert.FromBase64String(_configuration["JWT:EncryptionIV"] ?? String.Empty);

                using (var encryptor = aes.CreateEncryptor())
                using (var memoryStream = new MemoryStream())
                {
                    using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                    using (var streamWriter = new StreamWriter(cryptoStream))
                    {
                        streamWriter.Write(tokenDataJson);
                    }

                    var encryptedData = memoryStream.ToArray();
                    var encryptedRefreshToken = Convert.ToBase64String(encryptedData);

                    return encryptedRefreshToken;
                }
            }
        }
        private Dictionary<string, string>? DecryptRefreshToken(string? refreshToken)
        {
            try
            {
                if (refreshToken != null)
                {
                    using (var aes = Aes.Create())
                    {
                        aes.Key = Convert.FromBase64String(_configuration["JWT:EncryptionKey"] ?? String.Empty);
                        aes.IV = Convert.FromBase64String(_configuration["JWT:EncryptionIV"] ?? String.Empty);

                        using (var decryptor = aes.CreateDecryptor())
                        using (var memoryStream = new MemoryStream(Convert.FromBase64String(refreshToken)))
                        using (var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                        using (var streamReader = new StreamReader(cryptoStream))
                        {
                            var decryptedTokenJson = streamReader.ReadToEnd();
                            var tokenData = JsonConvert.DeserializeObject<Dictionary<string, string>>(decryptedTokenJson);
                            return tokenData;
                        }
                    }
                }
                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }
        public string GenrateAccessToken(string username, string userId)
        {
            // Generate a new access token
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.UTF8.GetBytes(_configuration.GetSection("JWT").GetSection("Key").Value ?? String.Empty);

            var ipAddress = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var userAgent = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"].ToString();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                            new Claim(ClaimTypes.Name, username),
                            new Claim("UserId", userId),
                            new Claim("IpAddress", ipAddress),
                            new Claim("UserAgent", userAgent)
                    // Add any other necessary claims
                }),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JWT:ExpiresTime"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var newAccessToken = tokenHandler.WriteToken(token);
            return newAccessToken;
        }
        public Tokens? RefreshToken(string? refreshToken, out HttpStatusCode? statusCode, out string? errorText)
        {
            try
            {
                // Decrypt the refresh token to retrieve the necessary claims and information
                var decryptedRefreshToken = DecryptRefreshToken(refreshToken);
                if (decryptedRefreshToken == null)
                {
                    statusCode = HttpStatusCode.Unauthorized;
                    errorText = "Invalid refresh token";
                    return null;
                }

                // Retrieve the necessary claims and information from the decrypted refresh token
                var userId = Convert.ToInt64(decryptedRefreshToken["userId"]);
                var username = decryptedRefreshToken["username"];
                var expiryTime = Convert.ToDateTime(decryptedRefreshToken["refershExpiryTime"]);
                // Retrieve any other necessary claims or information
                if (expiryTime > DateTime.UtcNow)
                {
                    var newAccessToken = GenrateAccessToken(username, userId.ToString());

                    // Generate a new refresh token
                    var newRefreshToken = GenerateRefreshToken();

                    var refreshTokenExpiryTime = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JWT:RefershTokenExpiresTime"]));

                    var tokenExpiryTime = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JWT:ExpiresTime"]));

                    // Encrypt and store necessary claims and information in the new refresh token
                    var encryptedRefreshToken = EncryptRefreshToken(newRefreshToken, refreshTokenExpiryTime, username, userId.ToString());

                    // Set the new refresh token expiry time

                    statusCode = HttpStatusCode.OK;
                    errorText = null;
                    return new Tokens { Token = newAccessToken, EmployeeId = (long)userId, RefreshToken = encryptedRefreshToken, RefreshTokenExpiryTime = refreshTokenExpiryTime, TokenExpiryTime = tokenExpiryTime };
                }
                statusCode = HttpStatusCode.Unauthorized;
                errorText = "Refresh token expired";
                return null;
            }
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
                errorText = "Something went wrong while refreshing the token: " + ex.Message;
                return null;
            }
        }
    }
}
