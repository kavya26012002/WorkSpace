using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.ServiceRequestControllerViewModel
{
    public class GetServiceResponseDetailsViewModel
    {
        public long Ticket { get; set; }
        public DateTime? RequestDate { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string ServiceGroup { get; set; }
        public string SubCategory { get; set; }
        public string Priority { get; set; }
        public string ServiceDetails { get; set; }
        public int Status { get; set; }
        public DateTime? PendingAt { get; set; }
        public string? Comments { get; set; } 
        public string? Attachments { get; set; } 
        public string? ClosedBy { get; set; }
        public DateTime? ClosedAt { get; set; }
        public string TotalRecords { get; set; }

    }
    public class serviceRequestModel
    {
        public List<GetServiceResponseDetailsViewModel> serviceRequestList { get; set; } = new List<GetServiceResponseDetailsViewModel>();
        public List<GetServiceCategoryDropdownViewModelResponse> categoryDropdownlist { get; set; } = new List<GetServiceCategoryDropdownViewModelResponse>();
        public List<GetServiceSubCategoryDropdownViewModelResponse> subCategoryDropdownlist { get; set; } = new List<GetServiceSubCategoryDropdownViewModelResponse>();
        public List<GetUpdateServiceDetailsViewModelResponse> updateservicerequestlist { get; set; } = new List<GetUpdateServiceDetailsViewModelResponse>();
    }
    public class GetDropdownDetailResponseModel
    {
        public string KeyId { get; set; } = String.Empty;
        public string DataValue { get; set; } = String.Empty;
    }
    public class GetServiceRequestInsertDetailsDropDownViewModelResponse
    {
        public GetServiceRequestInsertDetailsViewModelResponse? getServiceRequestInsertDetailsViewModelResponse { get; set; }
        public List<GetDropdownDetailResponseModel> serviceGroupList { get; set; } = new List<GetDropdownDetailResponseModel>();
        public List<GetDropdownDetailResponseModel> categoryList { get; set; } = new List<GetDropdownDetailResponseModel>();
        public List<GetDropdownDetailResponseModel> subCategoryList { get; set; } = new List<GetDropdownDetailResponseModel>();
    }
    public class GetServiceRequestInsertDetailsViewModelResponse
    {
        public string Name { get; set; }
        public DateTime RequestedDate { get; set; }
    }
    public class UpdateServiceRequestViewModelResponse
    {
        public long ServiceRequestId { get; set; }
        public long EmployeeId { get; set; }
        public long ReportingPersonId { get; set; }
        public long ServiceGroupId  { get; set; }
        public long CategoryId { get; set; }
        public long SubCategoryId { get; set; }
        public string ServiceRequetPriority { get; set; }
        public string ServiceDetails { get; set; }
        public string? Comments { get; set; }

    }

    public class GetServiceCategoryDropdownViewModelResponse
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
    public class GetServiceSubCategoryDropdownViewModelResponse
    {
        public int SubCategoryId { get; set; }
        public string SubCategoryName { get; set; }
    }
    public class GetUpdateServiceDetailsViewModelResponse
    {
        public long Ticket { get; set; }
        public DateTime? RequestDate { get; set; }
        public string Name { get; set; }
        public int ServiceGroupId { get; set; }
        public int CategoryId { get; set; }
        public int SubCategoryId { get; set; }

        public string Category { get; set; }
        public string ServiceGroup { get; set; }
        public string SubCategory { get; set; }
        public string Priority { get; set; }
        public string ServiceDetails { get; set; }
        public int Status { get; set; }
        public string? ExtraComments { get; set; }
        public DateTime? PendingAt { get; set; }
        public string? Comments { get; set; }
        public string? Attachment { get; set; }
        public string? ClosedBy { get; set; }
        public DateTime? ClosedAt { get; set; }
    }
    public class GetUpdateServiceRequestCategoryDropdownTopViewModelResponse
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
    public class GetUpdateServiceRequestCategoryDropdownBottomViewModelResponse
    {
        public int BottomCategoryId { get; set; }
        public string BottomCategoryName { get; set; }
    }

    public class UpdateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse
    {
        public List<GetUpdateServiceRequestCategoryDropdownTopViewModelResponse>? getUpdateServiceRequestCategoryDropdownTopViewModelResponse { get; set; }
        public List<GetUpdateServiceRequestCategoryDropdownBottomViewModelResponse>? getUpdateServiceRequestCategoryDropdownBottomViewModelResponse { get; set; }

    }



    public class GetUpdateServiceRequestSubCategoryDropdownTopViewModelResponse
    {
        public int SubCategoryId { get; set; }
        public string SubCategoryName { get; set; }
    }
    public class GetUpdateServiceRequestSubCategoryDropdownBottomViewModelResponse
    {
        public int BottomSubCategoryId { get; set; }
        public string BottomSubCategoryName { get; set; }
    }

    public class UpdateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse
    {
        public List<GetUpdateServiceRequestSubCategoryDropdownTopViewModelResponse>? getUpdateServiceRequestSubCategoryDropdownTopViewModelResponse { get; set; }
        public List<GetUpdateServiceRequestSubCategoryDropdownBottomViewModelResponse>? getUpdateServiceRequestSubCategoryDropdownBottomViewModelResponse { get; set; }

    }

}
