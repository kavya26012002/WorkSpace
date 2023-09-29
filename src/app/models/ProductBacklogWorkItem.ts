export interface ProductBacklogViewModelRequest
{
    ProjectWorkId:number,
    EmployeeId:number
}
export interface GetWorkItemAttachmentRequest
{
    ProjectWorkId:number
}
export interface DeleteWorkItemAttachmentRequest
{
    WorkItemAttachmentId:string
}
export interface GetupdateworkItemRequest{
    ProjectWorkId:number,
    Title:string,
    EmployeeId:number,
    SubProjectId:number,
    WorkGroupId:number,
    WorkFlow:number,
    Priority:string,
    Status:string,
    StartDate:any,
    EndDate:any,
    OriginalEst:any,
    RemainingEst:any,
    AssignedEmployeeId:number,
    ReportedEmployeeId:number,
    ReleasedToProduction:any,
    RSI:number,
    Description:string |null

}
 
export interface AddWorkItemCommentRequest
{
    ProjectWorkID:number,
    EmployeeId:number,
    Comments:string
}
export interface GetWorkItemCommentRequest
{
    ProjectWorkId:number
}
export interface DeleteWorkItemComments
{
    CommentId:number
}
export interface ProjectStatusState {
    workItemStateId: string,
    projectStatusId: number,
    employee: string,
    createdAt: Date
}
export interface WorkItemCommentResponse
{
    commentId:any,
    comment:any,
    name:any,
    createdDate:any
}
export interface UpdateWorkLogHistory
{
    WorkLogHistoryId:number,
    ProjectWorkID:number,
    WorkDoneOn:any,
    WorkTime:any,
    Description:string
}
export interface DeleteWorkLogHistory
{
    WorkLogHistoryId:number,
    ProjectWorkId:number
}
export interface GetHistoryTable
{
    ProjectWorkId:number,
    EmployeeId:number,
    PageNumber:any,
    PageSize:any;
  SortColumn:any;
  SortOrder:any;
}