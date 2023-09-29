using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkSpaceAPIEntites.ViewModels.TimeLogControllerViewModel;

namespace WorkSpaceAPIRepository.Interface
{
    public interface ITimeLogRepository
    {
        GetTimeLogDetailsViewModelResponse GetTimeLogDetail(GetTimeLogDetailsViewModelRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
       public List<GetTimeLogYearlyResponse>GetTimeLogYearly(GetTimeLogYearlyRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);
        public List<HoverTimeLogMonthlyResponse> GetTimeLogMonthlyHover(HoverTimeLogMonthlyRequest searchParams, out HttpStatusCode? statusCode, out string? errorText);


    }
}
