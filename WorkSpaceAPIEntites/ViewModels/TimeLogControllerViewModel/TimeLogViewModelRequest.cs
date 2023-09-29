using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.TimeLogControllerViewModel
{
    public class GetTimeLogDetailsViewModelRequest
    {
        public long EmployeeId { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }

    }
    public class GetTimeLogYearlyRequest
    {
        public long EmployeeId { get; set; }
        public int? Year { get; set; }
    }
    public class HoverTimeLogMonthlyRequest
    {
        public long EmployeeId { get; set; }
        public DateTime LogDate { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }


    }
}
