import { Pipe, PipeTransform } from '@angular/core';
import { Candidate } from '../Interfaces/candidate';

@Pipe({
  name: 'filterByStatus',
  standalone:true
})
export class FilterByStatusPipe implements PipeTransform {
  transform(candidates: Candidate[], status: string): Candidate[] {
    return candidates.filter(candidate => candidate.status === status);
  }
}
