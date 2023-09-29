import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { catchError, map, Observable, retry, tap, throwError } from 'rxjs';
import { GetAddWorkLog, GetUpdateworkItemRequest, GetWorkItemDetailsViewModelRequest, GetWorkItemDetailsViewModelResponse,  UserLogin } from 'src/app/models/userLogin';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'https://localhost:7268/api/Accounts/Login';
  private tokenKey = 'tokenKey';
  private apiUrlforEmployeeName = 'https://localhost:7268/api/WorkItem/GetReportedByDropdownForCreateWorkItem';
  private apiUrlforProjectDropdown = 'https://localhost:7268/api/WorkItem/GetWorkItemsList';
  private apiUrlViewWorkItem = 'https://localhost:7268/api/WorkItem/GetWorkItemsList';
  private apiGetUpdateWorkLog='https://localhost:7268/api/WorkItem/GetUpdateWorkItemDetails';
  private apiAddWorkLog='https://localhost:7268/api/WorkItem/UpdateWorkItem - Add WorkLog';


  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }
  
  login(user: UserLogin)
  {
    return this.http.post<any>(this.apiUrl,user);
  }

  refreshToken(refershRequest: any): Observable<any> {
    var refreshToken = localStorage.getItem('refreshToken');
    // console.log(refreshToken);
    var url = '';
    if (refreshToken != null)
    {
      url = `https://localhost:7268/api/Accounts/RefershToken`;
    }
    return this.http.post<any>(url, refershRequest).pipe(catchError(this.handleError));
  }
  getEmployeeNameById(employeeId: number) {
    const body = { employeeId: employeeId }; 
    return this.http.post<any>(this.apiUrlforEmployeeName, body).pipe(
      map((response) => {
      
        const employee = response.find((emp: any) => emp.employeeId === employeeId);
        return employee?.reportedBy || '';
      })
    );
  }
getProjectByEmployeeId(projectName:GetWorkItemDetailsViewModelRequest)
{
  return this.http.post<any>(this.apiUrlforProjectDropdown,projectName).pipe(catchError(this.handleError));
}
getUpdatedWorkItem(ProjectWorkId:GetUpdateworkItemRequest)
{
  return this.http.post<any>(this.apiGetUpdateWorkLog,ProjectWorkId).pipe(catchError(this.handleError))
}
getAddWorkLog(worklog:GetAddWorkLog)
{
  return this.http.post(this.apiAddWorkLog,worklog,{responseType:'text'})
}




  logout() {
   
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiryTime');
    localStorage.removeItem('refreshTokenExpiryTime');
    localStorage.removeItem('employeeId');
   
  }
  getTokenKey(): string {
    return this.tokenKey;
  }
  
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
 