using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.WorkItemControllerViewModel
{
    [BindProperties]
    public class GetWorkItemDetailsViewModelRequest
    {
        public long EmployeeId { get; set; }
        public string? ProjectName { get; set; } = string.Empty;
    }
    public class InsertWorkItemViewModelRequest
    {
        public long ProjectId { get; set; }
        public long EmployeeId { get; set; }
        public int SubProjectId { get; set; }
        public string Title { get; set; }
        public long WorkGroupId { get; set; }
        public int WorkFlow { get; set; }
        public string ProjectWorkItemsPriority { get; set; }
        public int ProjectStatusId { get; set; }
        public DateTime? StartDate { get; set; } = DateTime.Now;
        public DateTime? EndDate { get; set; } = DateTime.Now;
        public float OriginalEstTime { get; set; }
        public long AssignedEmployeeId { get; set; }
        public long ReportingEmployeeId { get; set; }
        public bool ReleasedToProduction { get; set; }
        public string? Description { get; set; }

    }
    public class GetEmployeeDetailsForInsertingWorkItemViewModelRequest
    {
        public long EmployeeId { get; set; }

    }
    public class UpdateWorkItemViewModelRequest
    {
        public long EmployeeId { get; set; }
        public long ProjectWorkId { get; set; }
        public DateTime? WorkDoneOn { get; set; }
        public float WorkTime { get; set; }
        //public float? Remaining { get; set; }
        public string? Description { get; set; }
    }
    public class GetUpdateWorkItemsViewModelRequest
    {
        public long ProjectWorkId { get; set; }
    }



}
