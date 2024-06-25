import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../Interfaces/candidate';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../Services/candidate.service';
import { FilterByStatusPipe } from '../../Pips/filterbystatus.pipe';
import { DatePipe, LowerCasePipe, UpperCasePipe, CurrencyPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [CommonModule, DatePipe, LowerCasePipe, UpperCasePipe, CurrencyPipe, PercentPipe, FilterByStatusPipe],
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {
  candidates: Candidate[] = [];

  constructor(private candidateService: CandidateService) { }

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.candidateService.getCandidates().subscribe(data => {
      this.candidates = Array.isArray(data) ? data : [];  // Ensure it's an array
    });
  }

  approveCandidate(candidate: Candidate): void {
    this.candidateService.approveCandidate(candidate).subscribe(() => {
      candidate.status = 'Approved';
      // Force update the list to reflect changes in approved tab
      this.candidates = [...this.candidates];
    }, error => {
      console.error('Error approving candidate:', error);
    });
  }

  rejectCandidate(candidateId: number): void {
    this.candidateService.rejectCandidate(candidateId).subscribe(() => {
      this.candidates = this.candidates.filter(candidate => candidate.id !== candidateId);
    }, error => {
      console.error('Error rejecting candidate:', error);
    });
  }
}
