import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GetTimeLog, GetTimeLogYearlyRequest, HoverTimeLogMonthlyRequest } from 'src/app/models/timelog';

@Injectable({
  providedIn: 'root'
})
export class TimelogService {
  private apiTimeLog='https://localhost:7268/api/TimeLog/GetTimeLogDetail';

  private apiTimeLogYearly = 'https://localhost:7268/api/TimeLog/GetTimeLogYearly';
  private apiHoverTimeLogMonthly = 'https://localhost:7268/api/TimeLog/GetTimeLogMonthlyHover';


  constructor(private http:HttpClient) { }
  getTimeLog(timelog:GetTimeLog)
{
  return this.http.post(this.apiTimeLog,timelog).pipe(catchError(this.handleError))
}
getTimeLogYearly(yearly:GetTimeLogYearlyRequest)
{
 return this.http.post(this.apiTimeLogYearly,yearly).pipe(catchError(this.handleError))
}

getHoverMontly(searchParams: HoverTimeLogMonthlyRequest): Observable<any> {
  return this.http.post(this.apiHoverTimeLogMonthly, searchParams).pipe(catchError(this.handleError));
}

handleError(error: HttpErrorResponse) {
  return throwError(error);
}
}
