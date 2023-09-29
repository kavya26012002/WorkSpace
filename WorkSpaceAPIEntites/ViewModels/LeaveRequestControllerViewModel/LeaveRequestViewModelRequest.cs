using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.LeaveRequestControllerViewModel
{
    [BindProperties]

    public class GetLeaveRequestDetailsViewModel
    {
        public long EmployeeId { get; set; }
        public string? LeaveStartDate { get; set; } = string.Empty;
        public string? LeaveEndDate { get; set; } = string.Empty;
        public string? LeaveRequestStatus { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string? SortColumn { get; set; }
        public bool? SortOrder { get; set; }

    }
    public class InsertLeaveRequestViewModelRequest
    {
        //public long LeaveRequestId { get; set; }
        public long EmployeeId { get; set; }
        public long ReportingPersonId { get; set; }
        public string ReasonForLeave { get; set; }
        public DateTime LeaveStartDate { get; set; }
        public DateTime LeaveEndDate { get; set; }
        public int StartDateAttendanceOption { get; set; }
        public int EndDateAttendanceOption { get; set; }
        public bool IsAdhocLeave { get; set; }
        public string? AdhocLeaveStatus { get; set; }
        public long? PhoneNumber { get; set; }
        public long? AlternatePhoneNumber { get; set; }
        public bool AvailibiltyOnPhone { get; set; }
        public bool AvailibiltyInCity { get; set; }
        //public string LeaveRequestStatus { get; set; }
        //public DateTime CreatedAt { get; set; }
        //public DateTime UpdateAt { get; set; }
        //public bool IsDeleted { get; set; }
    }
    public class GetEmployeeDetailsViewModelRequest
    {
        public long EmployeeId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

    }
    public class UpdateLeaveRequestViewModelRequest
    {
        public long LeaveRequestId { get; set; }
        public string? ReasonForLeave { get; set; }
        public DateTime? LeaveStartDate { get; set; }
        public DateTime? LeaveEndDate { get; set; }
        public int? StartDateAttendanceOption { get; set; }
        public int? EndDateAttendanceOption { get; set; }
        public bool? IsAdhocLeave { get; set; }
        public string? AdhocLeaveStatus { get; set; }
        public long? PhoneNumber { get; set; }
        public long? AlternatePhoneNumber { get; set; }
        public bool? AvailibiltyOnPhone { get; set; }
        public bool? AvailibiltyInCity { get; set; }
    }
    public class DeleteLeaveRequestViewModelRequest
    {
        public long EmployeeId { get; set; }
        public int LeaveRequestId { get; set; }
    }
    public class GetUpdateLeaveRequestViewModelRequest
    {
        public long LeaveRequestId { get; set; }

    }
}
