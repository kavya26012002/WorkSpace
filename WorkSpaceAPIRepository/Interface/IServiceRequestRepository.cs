using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkSpaceAPIEntites.ViewModels.ServiceRequestControllerViewModel;

namespace WorkSpaceAPIRepository.Interface
{
    public interface IServiceRequestRepository
    {
        public List<GetServiceResponseDetailsViewModel> GetServiceRequest(GetServiceRequestDetailsViewModel filterParams, out HttpStatusCode? StatusCode, out string? errorText);
        public void AddServiceRequest(InsertServiceRequestViewModelRequest addServiceRequestParams, out HttpStatusCode? StatusCode, out string? errorText);
        GetServiceRequestInsertDetailsDropDownViewModelResponse GetServiceDetailswithfillingDropdown(GetServiceRequestInsertDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public UpdateServiceRequestViewModelResponse UpdateServiceRequest(UpdateServiceRequestViewModelRequest updateServiceRequestParams, out HttpStatusCode StatusCode, out string? errorText);

        public List<GetServiceCategoryDropdownViewModelResponse> GetCategoryDropdown(GetServiceCategoryDropdownViewModelRequest serachParams, out HttpStatusCode? StatusCode, out string? errorText);
        public List<GetServiceSubCategoryDropdownViewModelResponse> GetSubCategoryDropdown(GetServiceSubCategoryDropdownViewModelRequest serachParams, out HttpStatusCode? StatusCode, out string? errorText);
        public List<GetUpdateServiceDetailsViewModelResponse> UpdateServiceRequestDetails(GetUpdateServiceDetailsViewModelRequest serachParams, out HttpStatusCode? StatusCode, out string? errorText);
        UpdateServiceRequestCategoryDropdownGetEmployeeDetailsModelResponse GetUpdateServiceRequestCategoryDropdownEmployeeDetails(GetUpdateCategoryDropdown searchParams, out HttpStatusCode? statusCode, out string? errorText);
        UpdateServiceRequestSubCategoryDropdownGetEmployeeDetailsModelResponse GetUpdateServiceRequestSubCategoryDropdownEmployeeDetails(GetUpdateSubCategoryDropdown searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public void ChangeServiceRequest(changeServiceRequestStatusViewModelRequest searchparams, out HttpStatusCode? StatusCode, out string? errorText);

    }

}
