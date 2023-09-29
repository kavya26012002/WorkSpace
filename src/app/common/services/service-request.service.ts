import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError,  Observable,  throwError } from 'rxjs';
import { ChangeServiceRequestStatus, GetServiceCategoryDropdownViewModelRequest, GetServiceDetail, GetServiceRequestInsertDetailsViewModelRequest, GetServiceSubCategoryDropdownViewModelRequest, GetUpdateCategoryDropDown, GetUpdateServiceRequestDetails, GetUpdateSubCategoryDropDown, InsertServiceRequest, UpdateServiceRequestViewModelRequest } from 'src/app/models/serviceRequest';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {
  private apiGetServiceDetails='https://localhost:7268/api/ServiceRequest/ServiceRequestDetails';
  private apiGetServiceDetailsInsertDetails='https://localhost:7268/api/ServiceRequest/GetServiceRequestInsertandDropdown';
  private apiGetCategoryDropdown = 'https://localhost:7268/api/ServiceRequest/GetCategoryDropdown';
  private apiGetSubCategoryDropdown = 'https://localhost:7268/api/ServiceRequest/GetSubCategoryDropdown';
  public apiInsertServiceRequest = 'https://localhost:7268/api/ServiceRequest/ServiceRequest-Add';
  public apiGetUpdateServiceRequestDetails = 'https://localhost:7268/api/ServiceRequest/UpdateServiceRequestDetails';
  private apiGetUpdateCAtegoryDropdown = 'https://localhost:7268/api/ServiceRequest/GetUpdateServiceRequestCategoryDropdownEmployeeDetails';
  private apiGetUpdateSubCategoryDropdown = 'https://localhost:7268/api/ServiceRequest/GetUpdateServiceRequestSubCategoryDropdownEmployeeDetails';
  private apiUpdateServiceRequest = 'https://localhost:7268/api/ServiceRequest/UpdateServiceRequest';
  private UpdateServiceRequestStatus = 'https://localhost:7268/api/ServiceRequest/ChangeServiceRequest';
  constructor(private http:HttpClient) { }

  getServiceDetails(requestparams: GetServiceDetail): Observable<any> {
    return this.http.post<any>(this.apiGetServiceDetails, requestparams);
  }
  getInsertServiceDetails(requestparams:GetServiceRequestInsertDetailsViewModelRequest)
  {
       return this.http.post(this.apiGetServiceDetailsInsertDetails,requestparams);
  }
  getCategoryDropDown(requestparams:GetServiceCategoryDropdownViewModelRequest)
  {
      return this.http.post(this.apiGetCategoryDropdown,requestparams);
  }
  getSubCategoryDropdown(requestparams:GetServiceSubCategoryDropdownViewModelRequest)
  {
    return this.http.post(this.apiGetSubCategoryDropdown,requestparams);
  }
  insertServiceRequest(requestparams:InsertServiceRequest)
  {
return this.http.post(this.apiInsertServiceRequest,requestparams,{responseType:'text'});
  }
  updateGetServiceRequest(requestparams:GetUpdateServiceRequestDetails)
  {
return this.http.post(this.apiGetUpdateServiceRequestDetails,requestparams);
  }
  updateCategoryDropdown(requestparams:GetUpdateCategoryDropDown)
  {
    return this.http.post(this.apiGetUpdateCAtegoryDropdown,requestparams);
  }
  updateSubCategoryDropdown(requestparams:GetUpdateSubCategoryDropDown)
  {
    return this.http.post(this.apiGetUpdateSubCategoryDropdown,requestparams);
  }
  updateServiceRequest(searchparms:UpdateServiceRequestViewModelRequest)
  {
return this.http.post(this.apiUpdateServiceRequest,searchparms,{responseType:'text'});
  }
  updateServiceRequestStatus(searchparms:ChangeServiceRequestStatus)
  {
return this.http.post(this.UpdateServiceRequestStatus,searchparms,{responseType:'text'});
  }
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
