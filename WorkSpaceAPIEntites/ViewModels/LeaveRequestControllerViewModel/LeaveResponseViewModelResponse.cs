using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkSpaceAPIEntites.ViewModels.LeaveRequestControllerViewModel
{
    public class GetLeaveResponseDetailsViewModel
    {
        public string RowNo { get; set; }
        public string LeaveRequestId { get; set; }
        public DateTime? LeaveStartDate { get; set; }
        public DateTime? LeaveEndDate { get; set; }
        public string Duration { get; set; }    
        public DateTime ReturnDate { get; set; }
        public bool AvailibiltyOnPhone { get; set; }
        public bool AvailibiltyInCity { get; set; }
        public string? LeaveRequestStatus { get; set; } = string.Empty;
        public DateTime? ApprovedDate { get; set; }
        public string TotalRecords { get; set; } 

    }
    public class GetEmployeeDetailsViewModelResponse
    {
        public int EmployeeId { get; set; } 
        public int ReportingPersonId { get; set; } 

        public string? EmployeeName { get; set; } = string.Empty;
        public string? ReportingPersonName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; } = string.Empty;
        public string? AlternatePhoneNumber { get; set; } = string.Empty;
        public DateTime? leaveStartDate { get; set; }
        public DateTime? leaveEndDate { get; set; }
        public DateTime? RequestedDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public int? Duration { get; set; }

    }
    public class UpdateLeaveRequestViewModelResponse
    {
        public long LeaveRequestId { get; set; }
        public string ReasonForLeave { get; set; }
        public DateTime LeaveStartDate { get; set; }
        public DateTime LeaveEndDate { get; set; }
        public int StartDateAttendanceOption { get; set; }
        public int EndDateAttendanceOption { get; set; }
        public bool? IsAdhocLeave { get; set; }
        public string? AdhocLeaveStatus { get; set; }
        public long? PhoneNumber { get; set; }
        public long? AlternatePhoneNumber { get; set; }
        public bool AvailibiltyOnPhone { get; set; }
        public bool AvailibiltyInCity { get; set; }
    }
    public class GetUpdateLeaveRequestBottomViewModelResponse
    {

        public string ReasonForLeave { get; set; }
        public DateTime LeaveStartDate { get; set; }
        public DateTime LeaveEndDate { get; set; }
        public DateTime RequestedDate { get; set; }
        public int StartDateAttendanceOption { get; set; }
        public int EndDateAttendanceOption { get; set; }
        public bool? IsAdhocLeave { get; set; }
        public string? AdhocLeaveStatus { get; set; }
        public long? PhoneNumber { get; set; }
        public long? AlternatePhoneNumber { get; set; }
        public bool AvailibiltyOnPhone { get; set; }
        public bool AvailibiltyInCity { get; set; }
    }
    public class GetUpdateLeaveRequestTopViewModelResponse
    {
        public long EmployeeId { get; set; }
        public long ReportingPersonId { get; set; }
        public string EmployeeName { get; set; }
        public string ReportingPersonName { get; set; }

    }

    public class LeaveRequestModel
    {
        public List<GetLeaveResponseDetailsViewModel> leaveRequestList { get; set; } = new List<GetLeaveResponseDetailsViewModel>();
    }
    public class insertLeaveRequestModel
    {
        public List<GetEmployeeDetailsViewModelResponse> leaverequestinsertlist { get; set; } = new List<GetEmployeeDetailsViewModelResponse>();

    }
    public class UpdateGetEmployeeDetailsModelResponse
    {
        public List<GetUpdateLeaveRequestTopViewModelResponse>? getUpdateLeaveRequestTopViewModelResponse { get; set; }
        public List<GetUpdateLeaveRequestBottomViewModelResponse>? getUpdateLeaveRequestBottomViewModelResponse { get; set; }

    }
}
