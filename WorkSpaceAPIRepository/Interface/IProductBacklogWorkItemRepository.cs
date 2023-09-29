using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkSpaceAPIEntites.ViewModels.ProductBacklogWorkItemControllerViewModel;

namespace WorkSpaceAPIRepository.Interface
{
    public interface IProductBacklogWorkItemRepository
    {
        public List<ProductBacklogViewModelResponse> GetProductBacklogWorkItemDetailsList(ProductBacklogViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public void AddWorkItemAttachment(AddWorkItemAttachmentRequest addWorkItemAttachmentRequest, string? filename, string? filePath, string? fileType, out HttpStatusCode? statusCode, out string? errorText);
        public List<GetWorkItemAttachmentResponse> GetWorkItemAttachment(GetWorkItemAttachmentRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public void DeleteWorkItemAttachment(DeleteWorkItemAttachmentRequest deleteAttachmentParams, out HttpStatusCode? StatusCode, out string? errorText);
        GetManageWorkItemTotalRsponse GetManageWorkItem(GetManageWorkItemRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public void UpdateWorkItems(UpdateWorkItemRequest updateparams, out HttpStatusCode StatusCode, out string? errorText);
        public List<GetWorkItemCommentResponse>? GetWorkItemComment(GetWorkItemCommentRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public List<GetWorkLogHistoryResponse>? GetWorkLogHistory(GetWorkItemCommentRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);


        //GetWorkItemCommentTotalResponse GetWorkItemComment(GetWorkItemCommentRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public void AddWorkItemComments(AddWorkItemCommentRequest addWorkItemCommentRequest, out HttpStatusCode? StatusCode, out string? errorText);
        public void DeleteWorkItemComment(DeleteWorkItemComments deleteAttachmentParams, out HttpStatusCode? StatusCode, out string? errorText);
        public List<WorkState>? GetWorkItemState(GetWorkItemCommentRequest searchparams,out HttpStatusCode? statusCode, out string? errorText);
        public void UpdateWorkLogHistory(UpdateWorkLogHistory updateparams, out HttpStatusCode StatusCode, out string? errorText);
        public void DeleteWorkLogEntry(DeleteWorkLogHistory deleteAttachmentParams, out HttpStatusCode? StatusCode, out string? errorText);
        //public List<GetHistoryTableResponse>? GetHistoryTable(GetWorkItemCommentRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public List<GetHistoryTableResponse> GetHistoryTable(GetHistoryTable filterParams, out HttpStatusCode? StatusCode, out string? errorText);











    }
}
