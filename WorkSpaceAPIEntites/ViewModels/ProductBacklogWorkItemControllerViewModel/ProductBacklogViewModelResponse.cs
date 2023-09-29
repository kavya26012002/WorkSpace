using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.ProductBacklogWorkItemControllerViewModel
{
    public class ProductBacklogViewModelResponse
    {
        public string? ProjectName { get; set; }
        public string? ProjectTitle { get; set; }
        public string? WorkGroup { get; set; }
        public int WorkFlow { get; set; }
        public string? Priority { get; set; }
        public int Status { get; set; }
        public string? AssignTo { get; set; }

        public string? ReportedBy { get; set; }
        public float RSI { get; set; }
        public string? CreatedAt { get; set; }
        public string? LastModifiedDate { get; set; }

        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public float OriginalEst { get; set; }
        public string? RemainingEst { get; set; }

        public float WorkLogged { get; set; }
        public string? Description { get; set; }

    }

    public class GetWorkItemAttachmentResponse
    {
        public string? Attachment { get; set; }
        public string? AttachmentPath { get; set; }
        public string? Description { get; set; }
        public DateTime? UploadedOn { get; set; }
        public string? AttachmentId { get; set; }
    }

    public class GetManageWorkItemTopPartResponse
    {
        public long ProjectWorkId { get; set; } 
        public string? ProjectTitle { get; set; }
        public string? Title { get; set; }
        public int? WorkGroupId { get; set; }
        public string? WorkGroup { get; set; }
        public int WorkFlowType { get; set; }
        public string? Priority { get; set; }
        public int Status { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public float OriginalEst { get; set; }
        public float RemainingEst { get; set; }
        public int? AssignedId { get; set; }
        public int? ReportedId { get; set; }
        public string? AssignedTo { get; set; }
        public string? ReportedBy { get; set; }
        public string? SubProject { get; set; }
        public int? SubProjectId { get; set; }
        public int ReleasedToProduction { get; set; }
        public int RSI { get; set; }
        public string? Descriptions { get; set; }

    }
    public class GetManageWorkItemReportingByList
    {
        public int? EmployeeId { get; set; }
        public string? ReposrtingPersonName { get; set; }
    }
    public class GetManageWorkItemSubProjectList
    {
        public int? SubProjectId { get; set; }
        public string? SubProjectList { get; set; }
    }

    public class GetManageWorkItemTotalRsponse
    {
        public List<GetManageWorkItemTopPartResponse>? getManageWorkItemTopPartResponse { get; set; }
        public List<GetManageWorkItemReportingByList>? getManageWorkItemReportingByList { get; set; }
        public List<GetManageWorkItemSubProjectList>? getManageWorkItemSubProjectList { get; set; }
    }
  public class GetWorkItemCommentResponse
    {
        public long CommentId { get; set; }
        public string? Comment { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedDate { get; set; }

    }

  

    public class WorkState
    {
        public long WorkItemStateId { get; set; }
        public long ProjectStatusId { get; set; }
        public string Employee { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
    public class GetWorkLogHistoryResponse
    {
        public long WorkLogHistoryId { get; set; }
        public  DateTime WorkDate { get; set; }
        public float WorkedHours { get; set; }
        public string? Employee { get; set; }
        public string? Description { get; set; }
        public string? TotalRecords { get; set; }


    }
    public class GetHistoryTableResponse
    {
        public string RowNo { get; set; }
        public long HistoryId { get; set; }
        public long ProjectWorkId{ get; set; }
        public string? Field { get; set; }
        public long EmployeeId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public string TotalRecords { get; set; }
        public string EmployeeName { get; set; }

    }
    public class HistoryTableRequestModel
    {
        public List<GetHistoryTableResponse> historyRequestList { get; set; } = new List<GetHistoryTableResponse>();
    }

}
