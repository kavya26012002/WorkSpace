import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AddWorkItemCommentRequest, DeleteWorkItemAttachmentRequest, DeleteWorkItemComments, DeleteWorkLogHistory, GetHistoryTable, GetupdateworkItemRequest, GetWorkItemAttachmentRequest, GetWorkItemCommentRequest, ProductBacklogViewModelRequest, UpdateWorkLogHistory } from 'src/app/models/ProductBacklogWorkItem';

@Injectable({
  providedIn: 'root'
})
export class ProductBacklogWorkItemService {
  private api_key = localStorage.getItem("tokenKey");

  private apiGetProductBacklogWorkItemDetailsList='https://localhost:7268/api/ProductBacklogWorkItem/GetProductBacklogWorkItemDetailsList';
  private apiUploadFile = 'https://localhost:7268/api/ProductBacklogWorkItem/AddWorkItemAttachment';
  private apiGetWorkItemAttachment = 'https://localhost:7268/api/ProductBacklogWorkItem/GetWorkItemAttachment';
  private apiDeleteWorkItemAttachment = 'https://localhost:7268/api/ProductBacklogWorkItem/DeleteWorkItemAttachment';
  private apiGetProjectWorkItems = 'https://localhost:7268/api/ProductBacklogWorkItem/GetManageWorkItem';
  private apiUpdateWorkItems = 'https://localhost:7268/api/ProductBacklogWorkItem/UpdateWorkItems';
  private apiInsertWorkItemComment = 'https://localhost:7268/api/ProductBacklogWorkItem/AddWorkItemComments';
  private apiGetWorkItemComment = 'https://localhost:7268/api/ProductBacklogWorkItem/GetWorkItemComment';
  private apiDeleteWorkItemComment = 'https://localhost:7268/api/ProductBacklogWorkItem/DeleteWorkItemComment';
  private apiGetWorkItemState='https://localhost:7268/api/ProductBacklogWorkItem/GetWorkItemState';
  private apiGetWorkLogHistory = 'https://localhost:7268/api/ProductBacklogWorkItem/GetWorkLogHistory';
  private apiUpdateWorkLogHistory = 'https://localhost:7268/api/ProductBacklogWorkItem/UpdateWorkLogHistory';
  private apiDeleteWorkLogHistory = 'https://localhost:7268/api/ProductBacklogWorkItem/DeleteWorkLogEntry';
  private apiGetHistory='https://localhost:7268/api/ProductBacklogWorkItem/GetHistoryTable';
  private requestOptions: { 
    headers: HttpHeaders,
    reportProgress: true 
  };
  constructor(private http:HttpClient) { 
    this.requestOptions = { headers: this.getCommonHeaders() , reportProgress: true}

  }
  private getCommonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.api_key}`
    });
  }
  GetWorkItemDetailList(searchparms:ProductBacklogViewModelRequest)
  {
    return this.http.post(this.apiGetProductBacklogWorkItemDetailsList,searchparms);
  }
  uploadFile(request: FormData): Observable<any> {
    return this.http.post<any>(this.apiUploadFile,request,this.requestOptions).pipe(catchError(this.handleError))

  }
  getAttachment(searchparms:GetWorkItemAttachmentRequest)
  {
    return this.http.post(this.apiGetWorkItemAttachment,searchparms).pipe(catchError(this.handleError))
  }
  DeleteAttachment(searchparams:DeleteWorkItemAttachmentRequest)
  {
  return this.http.post(this.apiDeleteWorkItemAttachment,searchparams,{responseType:'text'}).pipe(catchError(this.handleError));
  }
 GetManageWorkItem(searchparms:GetWorkItemAttachmentRequest)
 {
   return this.http.post(this.apiGetProjectWorkItems,searchparms).pipe(catchError(this.handleError))
 }
 UpdateWorkItems(searchParams:GetupdateworkItemRequest)
 {
   return this.http.post(this.apiUpdateWorkItems,searchParams,{responseType:'text'});
 }
 InsertComments(searchparams:AddWorkItemCommentRequest)
 {
return this.http.post(this.apiInsertWorkItemComment,searchparams,{responseType:'text'});
 }
 GetWorkItemComment(searchparams:GetWorkItemCommentRequest)
 {
  return this.http.post(this.apiGetWorkItemComment,searchparams);
 }
 DeleteWorkItemComment(searchParams:DeleteWorkItemComments)
 {
return this.http.post(this.apiDeleteWorkItemComment,searchParams,{responseType:'text'});
 }
 getProjectStatusState(searchParams: GetWorkItemCommentRequest){
  return this.http.post(this.apiGetWorkItemState, searchParams).pipe(catchError(this.handleError));
}
GetWorkLogHistory(searchparams:GetWorkItemCommentRequest)
{
return this.http.post(this.apiGetWorkLogHistory,searchparams).pipe(catchError(this.handleError));
}
UpdateWorkLogHistory(searchparams:UpdateWorkLogHistory)
{
return this.http.post(this.apiUpdateWorkLogHistory,searchparams,{responseType:'text'}).pipe(catchError(this.handleError));
}
DeleteWorkLogEntry(searchparams:DeleteWorkLogHistory)
{
return this.http.post(this.apiDeleteWorkLogHistory,searchparams,{responseType:'text'});
}
getHistory(searchparams:GetHistoryTable)
{
return this.http.post(this.apiGetHistory,searchparams).pipe(catchError(this.handleError))
}
  handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
