using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.ServiceRequestControllerViewModel
{
    [BindProperties]
    public class GetServiceRequestDetailsViewModel
    {
        public long EmployeeId { get; set; }
        public int? TicketNumber { get; set; }
        public int? RequestStatus { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string? SortColumn { get; set; }
        public bool? SortOrder { get; set; }
    }
    public class InsertServiceRequestViewModelRequest
    {
        public long EmployeeId { get; set; }
        public int ServiceGroupId { get; set; }
        public int CategoryId { get; set; }
        public int SubCategoryId { get; set; }
        public string ServiceRequestPriority { get; set; }
        public string ServiceDetails { get; set; }
    }
    public class GetServiceRequestInsertDetailsViewModelRequest
    {
        public long EmployeeId { get; set; }
    }
    public class UpdateServiceRequestViewModelRequest
    {
        public long ServiceRequestId { get; set; }
        public DateTime RequestedDate { get; set; }
        public int Status { get; set; }
        public int ServiceGroupId { get; set; }
        public int CategoryId { get; set; }
        public int SubCategoryId  { get; set; }
        public string ServiceRequestPriority { get; set; }
        public string ServiceDetails { get; set; }
        public string? Comments { get; set; }
    }
    public class GetServiceCategoryDropdownViewModelRequest
    {
        public int InputServiceGroupId { get; set; }
    }
    public class GetServiceSubCategoryDropdownViewModelRequest
    {
        public int InputCategoryId { get; set; }
    }
    public class GetUpdateServiceDetailsViewModelRequest
    {
    public int ServiceRequestId { get; set; }
    }
    public class GetUpdateCategoryDropdown
    {
        public int InputServiceGroupId { get; set;}
        public int ServiceRequestId { get; set;}
    }
    public class GetUpdateSubCategoryDropdown
    {
        public int InputCategoryId { get; set; }
        public int ServiceRequestId { get; set; }
    }
    public class changeServiceRequestStatusViewModelRequest
    {
        public int employeeId { get; set; }
        public int RequestStatus { get; set; }
        public int ServicerequestId { get; set; }
        public string? Comments { get; set; } 


    }





}
