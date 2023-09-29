  import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { DeleteLeaveRequest, GetEmployeeDetailsViewModelRequest, GetLeaveRequest, GetUpdateEmployeeDetail, insertLeaveRequest, UpdateLeaveRequest } from 'src/app/models/leaveRequest';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private apiGetLeaveRequest='https://localhost:7268/api/LeaveRequest/LeaveRequestDetails';
  private apiGetInsertGetEmployeeDetails ='https://localhost:7268/api/LeaveRequest/GetEmployeeDetails';
  private apiInsertLeaveRequest='https://localhost:7268/api/LeaveRequest/LeaveRequest-Add';
  private apiDeleteLeaveRequest = 'https://localhost:7268/api/LeaveRequest/LeaveRequest-Delete';
  private apiUpdateGetEmployeeDetails='https://localhost:7268/api/LeaveRequest/GetEmployeeDetailsForUpdateLeaveRequest';
  private apiUpdateLeaveRequest = 'https://localhost:7268/api/LeaveRequest/UpdateLeaveRequest';

  constructor(private http:HttpClient) { 

  }
  getLeaveRequest(leaverequestdetails:GetLeaveRequest)
  {
return this.http.post(this.apiGetLeaveRequest,leaverequestdetails).pipe(catchError(this.handleError))
  }
  getLeaveRequestInsertDetails(leaverequestinsert:GetEmployeeDetailsViewModelRequest)
  {
      return this.http.post(this.apiGetInsertGetEmployeeDetails,leaverequestinsert).pipe(catchError(this.handleError))
  }
  insertLeaveRequest(insert:insertLeaveRequest)
  {
     return this.http.post(this.apiInsertLeaveRequest,insert,{responseType:'text'})
  }
  DeleteLeaveRequest(deleterequest:DeleteLeaveRequest)
  {
    return this.http.post(this.apiDeleteLeaveRequest,deleterequest,{responseType:'text'})
  }
  UpdateGetEmployeeDetails(getUpdateDeatils:GetUpdateEmployeeDetail)
 {
return this.http.post(this.apiUpdateGetEmployeeDetails,getUpdateDeatils).pipe(catchError(this.handleError))
  }
  UpdateLeaveRequest(updaterequestparams:UpdateLeaveRequest)
  {
    return this.http.post(this.apiUpdateLeaveRequest,updaterequestparams,{responseType:'text'});
  }
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
