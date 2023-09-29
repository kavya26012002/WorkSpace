using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.ProductBacklogWorkItemControllerViewModel
{
    public class ProductBacklogViewModelRequest
    {
        public int ProjectWorkId { get; set; }
        public long EmployeeId { get; set; }
    }
    public class AddWorkItemAttachmentRequest
    {
        public long ProjectWorkId { get; set; }
        public string? filePath { get; set; }
        public string? filename { get; set; }
        public string? Description { get; set; }
        public string? fileType { get; set; }

    }
    public class GetWorkItemAttachmentRequest
    {
        public long ProjectWorkId { get; set; }

    }
    public class DeleteWorkItemAttachmentRequest
    {
        public long WorkItemAttachmentId { get; set; }

    }
    public class GetManageWorkItemRequest
    {
        public long ProjectWorkId { get; set; }
    }
    public class UpdateWorkItemRequest
    {
        public long ProjectWorkId { get; set; }
        public string? Title { get; set; }
        public long EmployeeId { get; set; }
        public long SubProjectId { get; set; }
        public long WorkGroupId { get; set; }
        public long WorkFlow { get; set; }
        public string? Priority { get; set; }
        public int? Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public float OriginalEst { get; set; }
        public float RemainingEst { get; set; }
        public long AssignedEmployeeId { get; set; }
        public long ReportedEmployeeId { get; set; }
        public bool? ReleasedToProduction { get; set; }
        public int RSI { get; set; }
        public string? Description { get; set; }
    }
    public class GetWorkItemCommentRequest
    {
        public long ProjectWorkId { get; set; }
    }
    public class AddWorkItemCommentRequest
    {
        public long ProjectWorkID { get; set; }
        public long EmployeeId { set; get; }
        public string? Comments { get; set; }

    }
    public class DeleteWorkItemComments
    {
        public long CommentId { get; set; }

    }
    public class UpdateWorkLogHistory
    { 
    public long  WorkLogHistoryId { get; set; }
    public long ProjectWorkID { get; set; }
    public DateTime WorkDoneOn { get; set; }
        public float WorkTime { get; set; }
        public string? Description { get; set; }

    }
    public class DeleteWorkLogHistory
    {
        public long WorkLogHistoryId { get; set; }
        public long ProjectWorkId { get; set; }

    }

    public class GetHistoryTable
    {
        public long ProjectWorkId { get; set; }
        public long EmployeeId { get; set; }

        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string? SortColumn { get; set; }
        public bool? SortOrder { get; set; }
    }



}
