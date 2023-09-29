import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateServiceRequestService {
  
    updateSuccessSubject=new Subject<any>();
 
}