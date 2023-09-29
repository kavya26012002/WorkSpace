using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.AccountControllerViewModel
{
    public class Tokens
    {
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public DateTime? TokenExpiryTime { get; set; }
        public long? EmployeeId { get; set; }
    }
    public class LoginResponseStatus
    {
        public long? EmployeeId { get; set; }
        public bool Success { get; set; } = false;
        public string Message { get; set; } = string.Empty;
    }
}

