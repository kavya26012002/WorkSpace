using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.WorkItemControllerViewModel
{
    public class GetWorkItemDetailsViewModelResponse
    {
        public string ProjectName { get; set; }
        public int ProjectId { get; set; }
       
        public string Title { get; set; }
        public int Step { get; set; }
        public string Priority { get; set; }
        public string Estimation { get; set; }
        public string Remaining { get; set; }
        public string WorkDone { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
    public class InsertWorkItemViewModelResponse
    {
        public long ProjectId { get; set; }
        public long EmployeId { get; set; }
        public int SubProjectId { get; set; }
        public string Title { get; set; }
        public long WorkGroupId { get; set; }
        public int WorkFlow { get; set; }
        public string ProjectWorkItemsPriority { get; set; }
        public int ProjectStatusId { get; set; }
        public DateTime? StartDate { get; set; } = DateTime.Now;
        public DateTime? EndDate { get; set; } = DateTime.Now;
        public float OriginalEstTime { get; set; }
        public float RemainingEstTime { get; set; }
        public long AssignedEmployeeId { get; set; }
        public long ReportingEmployeeId { get; set; }
        public bool ReleasedToProduction { get; set; }
        public bool RSI { get; set; }
        public string? Description { get; set; }
    }
    public class GetEmployeeDetailsForInsertingWorkItemViewModelResponse
    {
        public long EmployeeId { get; set; }
        public string ReportedBy { get; set; }
    }

    public class UpdateWorkItemViewModelResponse
    {
        public long EmployeeId { get; set; }
        
        public long ProjectWorkId { get; set;}
        public DateTime WorkDoneOn { get; set; }
        public float WorkTime { get; set; }
        public float? RemainingEst { get; set; } = 0;
        public string? Description { get;  set; }
    }
    public class GetUpdateWorkItemsViewModelResponse
    {
        public string? Title { get; set; }
        public string WorkItemName { get; set; }
        public string WorkDoneBy { get; set; }
        public string WorkDoneOn { get; set; }
        public float? OriginalEst { get; set; }
        public float? RemainingHours { get; set; }
        public string? WorkDone { get; set; }
        public string ? Description { get; set; }
    }



    public class WorkItemModel
    {
        public List<GetWorkItemDetailsViewModelResponse> workItemList { get; set; } = new List<GetWorkItemDetailsViewModelResponse>();
    }
}
