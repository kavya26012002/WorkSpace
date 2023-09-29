using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.TimeSheetControllerViewModel
{
    [BindProperties]
    public class GetTimeSheetDetailsViewModelRequest
    {
        public long EmployeeId { get; set; }
        public int? Month  { get; set; }
        public int? Year { get; set; }
    }

    public class TimeSheetHoverViewModelRequest
    {
        public long EmployeeId { get; set; }
        public int ProjectId { get; set; }
    }

}

