import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiaplayHeaderService {
  private selectedItemSource = new Subject<string>();
  selectedItem$ = this.selectedItemSource.asObservable();

  setSelectedItem(itemName: string) {
    this.selectedItemSource.next(itemName);
  }
}
