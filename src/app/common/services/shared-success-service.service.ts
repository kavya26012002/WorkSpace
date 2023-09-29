import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedSuccessServiceService {
  private successMessageSubject = new BehaviorSubject<string | null>(null);
  private serviceRequestrouter = new BehaviorSubject<string | null>(null);
  private serviceRequestworklog: Subject<string | null> = new Subject<string | null>();


  setSuccessMessage(message: string) {
    this.successMessageSubject.next(message);
  }
  getSuccessMessage(): Observable<string | null> {
    return this.successMessageSubject.asObservable();
  }
  setServiceRouter(message:string)
  {
    this.serviceRequestrouter.next(message);


  }
getServceRouter():Observable<string | null>
{
  return this.serviceRequestrouter.asObservable();
}
setServiceRequestWorklog(message: string) {
  this.serviceRequestworklog.next(message);
  console.log("service", message);
}
getServiceRequestWorkLog(): Observable<string | null> {
  return this.serviceRequestworklog.asObservable();
}
  constructor() { }
}
