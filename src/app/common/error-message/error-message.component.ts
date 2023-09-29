import { Component, Input, OnInit } from '@angular/core';
import { SharedSuccessServiceService } from '../services/shared-success-service.service';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements OnInit{
  @Input() showError: boolean = false;
  @Input() showSuccess: boolean = false;
  @Input() errorMessage: string = '';
  @Input() successMessage: string = '';
/**
 *
 */
constructor(private sharedSuccessService: SharedSuccessServiceService) {}

// ngOnInit(): void {
//   console.log(this.showSuccess);
//   console.log(this.successMessage);

// }
ngOnInit(): void {
  // Subscribe to the successMessage observable
  this.sharedSuccessService.getSuccessMessage().subscribe((message) => {
    if (message) {
      this.showSuccess = true;
      this.successMessage = message;
    } else {
      this.showSuccess = false;
      this.successMessage = '';
    }
  });
}
}


