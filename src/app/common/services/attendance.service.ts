import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Constants } from 'src/app/models/common';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private api_key = localStorage.getItem("tokenKey");
  private requestOptions: { headers: HttpHeaders };
  private api_endpoint = Constants.API_ENDPOINT; 
  constructor(private http: HttpClient) {
    this.requestOptions = { headers: this.getCommonHeaders() }
  }
  private getCommonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.api_key}`
    });
  }
  getAttendance(request: any): Observable<any> {
    return this.http.post<any>( this.api_endpoint + "api/Attendance/GetAttendance", request, this.requestOptions).pipe(catchError(this.handleError));
  }
  addAttendance(request: any): Observable<any> {
    return this.http.post<any>( this.api_endpoint + "api/Attendance/AddOrUpdateAttendance", request, this.requestOptions).pipe(catchError(this.handleError));
  }
  getHoliday(): Observable<any> {
    return this.http.get<any>( this.api_endpoint + "api/Attendance/HolidayList", this.requestOptions).pipe(catchError(this.handleError));
  }
  handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
