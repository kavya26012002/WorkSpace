using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.Common
{
    public class CommonResponseStatus
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;

    }
    public class CommonResponse<ResponceClass>
    {
        public Boolean IsError { get; set; } = true;
        public string ErrorMessage { get; set; } = String.Empty;
        public ResponceClass? Responce { get; set; }
    }
}
