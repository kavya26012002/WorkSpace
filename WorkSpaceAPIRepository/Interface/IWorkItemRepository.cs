using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkSpaceAPIEntites.ViewModels.WorkItemControllerViewModel;

namespace WorkSpaceAPIRepository.Interface
{
    public interface IWorkItemRepository
    {
        public List<GetWorkItemDetailsViewModelResponse> GetWorkItemsList(GetWorkItemDetailsViewModelRequest filterParams, out HttpStatusCode? StatusCode, out string? errorText);
        public List<GetEmployeeDetailsForInsertingWorkItemViewModelResponse> GetAllEmployeeName(GetEmployeeDetailsForInsertingWorkItemViewModelRequest getEmployeeDetailsParams, out HttpStatusCode StatusCode, out string? errorText);

        public void AddWorkItemRequest(InsertWorkItemViewModelRequest addWorkItemRequestParams, out HttpStatusCode? StatusCode, out string? errorText);
        public UpdateWorkItemViewModelResponse UpdateWorkItem(UpdateWorkItemViewModelRequest updateWorkItemsParams, out HttpStatusCode StatusCode, out string? errorText);
        public GetUpdateWorkItemsViewModelResponse GetUpdateWorkItemDetails(GetUpdateWorkItemsViewModelRequest getworkitemsRequestParams, out HttpStatusCode StatusCode, out string? errorText);



    }
}
