using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WorkSpaceAPIEntites.ViewModels.AccountControllerViewModel;
using WorkSpaceAPIEntites.ViewModels.Common;
using WorkSpaceAPIRepository.Interface;

namespace WorkSpaceAPI.Controllers
{
    [EnableCors("_myAllowedSpecificOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IAccountsRepository _accoutRepository;

        public AccountsController(IConfiguration configuration, IAccountsRepository actionRepository)
        {
            _configuration = configuration;
            _accoutRepository = actionRepository;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("Login")]
        public IActionResult Login(LoginRequest loginRequest)
        {
            var token = _accoutRepository.Authenticate(loginRequest, out HttpStatusCode? StatusCode, out string? errorText);
            CommonResponse<Tokens> responce = new CommonResponse<Tokens>();
            responce.ErrorMessage = errorText ?? String.Empty;
            responce.Responce = token;
            if (StatusCode != HttpStatusCode.OK)
            {
                responce.IsError = true;
                return BadRequest(responce);
            }
            else if (token == null)
            {
                responce.IsError = true;
                return Unauthorized(responce);
            }
            responce.IsError = false;
            return Ok(responce);
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("RefershToken")]
        public IActionResult RefershToken(RefershRequest refershRequest)
        {
            var token = _accoutRepository.RefreshToken(refershRequest.refershToken, out HttpStatusCode? StatusCode, out string? errorText);
            CommonResponse<Tokens> responce = new CommonResponse<Tokens>();
            responce.ErrorMessage = errorText ?? String.Empty;
            responce.Responce = token;
            if (StatusCode != HttpStatusCode.OK)
            {
                responce.IsError = true;
                return BadRequest(responce);
            }
            else if (token == null)
            {
                responce.IsError = true;
                return Unauthorized(responce);
            }
            responce.IsError = false;
            return Ok(responce);
        }


    }
}
