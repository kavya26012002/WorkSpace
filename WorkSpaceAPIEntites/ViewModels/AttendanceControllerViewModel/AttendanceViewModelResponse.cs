using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.AttendanceControllerViewModel
{
   
        public class AttendanceResponse
        {
            public DateTime CurrentDate { get; set; }
            public String CurrentWeekDay { get; set; } = String.Empty;
            public int? AttendanceOption { get; set; }
            public bool? IsApproved { get; set; }
        }
        public class GetHoliday
        {
            public long Key { get; set; } = 0;
            public DateTime Value { get; set; } = DateTime.Now;
        }
    }

