import { Pipe, PipeTransform } from '@angular/core';
import { ServiceRequestStatus } from 'src/app/models/enum';

@Pipe({
  name: 'enumValue'
})
export class EnumValuePipe implements PipeTransform {
  transform(value: number): string {
    // Convert enum value to its corresponding name
    return ServiceRequestStatus[value];
  }
}
