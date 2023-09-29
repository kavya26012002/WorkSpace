using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkSpaceAPIEntites.ViewModels.AccountControllerViewModel;

namespace WorkSpaceAPIRepository.Interface
{
    public interface IAccountsRepository
    {
        public Tokens? Authenticate(LoginRequest loginRequest, out HttpStatusCode? statusCode, out string? errorText);
        public Tokens? RefreshToken(string refreshToken, out HttpStatusCode? statusCode, out string? errorText);
      
    }
}

