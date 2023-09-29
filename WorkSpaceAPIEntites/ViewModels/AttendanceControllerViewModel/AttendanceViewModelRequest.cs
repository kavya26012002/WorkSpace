using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.AttendanceControllerViewModel
{
    [BindProperties]

   
    
        public class SearchAttendancerequest
        {
            public long EmployeeId { get; set; } = 0;
            //[Range(1, 12, ErrorMessage = "Invalid month value. Month must be between 1 and 12.")]
            public int? Month { get; set; }

            //[Range(1900, 9999, ErrorMessage = "Invalid year value. Year must be between 1900 and 9999.")]
            public int? Year { get; set; }
        }
        public class AttendanceRequest
        {
            public long EmployeeId { get; set; } = 0;
            public int AttendanceOption { get; set; } = 0;
        }
        public class ApproveAttendanceRequest
        {
            public long EmployeeId { get; set; } = 0;
            public long ReportingPersonId { get; set; } = 0;
            public DateTime AttendanceDate { get; set; } = DateTime.Now;
            public bool isApproved { get; set; } = true;
        }
    }

