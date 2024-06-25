import { Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

@Pipe({
  name: 'filterByStatus',
  standalone:true
})
export class FilterByStatusPipe implements PipeTransform {
  transform(items: any[], status: string): any[] {
    if (!items || !status) {
      return items;
    }
    return items.filter(item => item.status === status);
  }
}
