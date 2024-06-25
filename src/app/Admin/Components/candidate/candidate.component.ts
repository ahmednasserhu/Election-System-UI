import { Component ,OnInit } from '@angular/core';
import { Candidate } from '../../Interfaces/candidate';
import { CommonModule } from '@angular/common';
import { FilterByStatusPipe } from '../../Pips/filterbystatus.pipe';
import { CandidateService } from '../../Services/candidate.service';
import { DatePipe,LowerCasePipe,UpperCasePipe,CurrencyPipe,PercentPipe } from '@angular/common';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [CommonModule,DatePipe,LowerCasePipe,UpperCasePipe,CurrencyPipe,PercentPipe,FilterByStatusPipe],
  templateUrl: './candidate.component.html',
  styleUrl: './candidate.component.css'
})
export class CandidateComponent implements OnInit{
  candidates: Candidate[] = [];
  selectedCandidate: Candidate | null = null;
  candidateStats: any = {};

  constructor(private candidateService: CandidateService) { }

  ngOnInit(): void {
    this.loadCandidates();
    this.updateAnalytics();
  }

  loadCandidates(): void {
    this.candidateService.getCandidates().subscribe(data => {
      this.candidates = data;
      this.updateAnalytics();
    });
  }

  approveCandidate(candidate: Candidate): void {
    this.candidateService.approveCandidate(candidate).subscribe(() => {
      candidate.status = 'Approved';
      this.updateAnalytics();
    });
  }

  rejectCandidate(candidateId: number): void {
    this.candidateService.rejectCandidate(candidateId).subscribe(() => {
      this.candidates = this.candidates.filter(candidate => candidate.id !== candidateId);
      this.updateAnalytics();
    });
  }

  updateAnalytics() {
    this.candidateStats.total = this.candidates.length;
    this.candidateStats.byParty = this.groupBy(this.candidates, 'party');
    this.candidateStats.byStatus = this.groupBy(this.candidates, 'status');
  }

  groupBy(array: any[], key: string) {
    return array.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {});
  }
}
