using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkSpaceAPIEntites.ViewModels.LeaveRequestControllerViewModel;

namespace WorkSpaceAPIRepository.Interface
{
    public interface ILeaveRequestRepository
    {
        public List<GetLeaveResponseDetailsViewModel> GetLeaveRequest(GetLeaveRequestDetailsViewModel filterParams, out HttpStatusCode? StatusCode, out string? errorText);
        public void AddLeaveRequest(InsertLeaveRequestViewModelRequest addLeaveRequestParams , out HttpStatusCode? StatusCode, out string? errorText);
        public List<GetEmployeeDetailsViewModelResponse> GetEmployeeDetails(GetEmployeeDetailsViewModelRequest getEmployeeDetailsParams, out HttpStatusCode StatusCode, out string? errorText);
        public UpdateLeaveRequestViewModelResponse UpdateLeaveRequest(UpdateLeaveRequestViewModelRequest updateLeaveRequestParams, out HttpStatusCode StatusCode, out string? errorText);
        UpdateGetEmployeeDetailsModelResponse GetUpdateEmployeeDetail(GetUpdateLeaveRequestViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public void DeleteLeaveRequest(DeleteLeaveRequestViewModelRequest deleteLeaveRequestParams, out HttpStatusCode? StatusCode, out string? errorText);

    }
}
