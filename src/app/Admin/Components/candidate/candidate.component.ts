import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../Interfaces/candidate';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../Services/candidate.service';
import { FilterByStatusPipe } from '../../Pips/filterbystatus.pipe';
import { DatePipe, LowerCasePipe, UpperCasePipe, CurrencyPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    LowerCasePipe,
    UpperCasePipe,
    CurrencyPipe,
    PercentPipe,
    FilterByStatusPipe
  ],
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
    this.candidateService.getCandidates().subscribe(
      data => {
        this.candidates = data.paginationResults?.results || [];
      },
      error => {
        console.error('Error loading candidates:', error);
      }
    );
  }

  approveCandidate(candidate: Candidate): void {
    this.candidateService.approveCandidate(candidate._id).subscribe(
      () => {
        candidate.status = 'approved';
        // Update the list to reflect changes
        this.candidates = [...this.candidates];
      },
      error => {
        console.error('Error approving candidate:', error);
      }
    );
  }

  rejectCandidate(candidate: Candidate): void {
    this.candidateService.rejectCandidate(candidate._id).subscribe(
      () => {
        this.candidates = this.candidates.filter(c => c._id !== candidate._id);
      },
      error => {
        console.error('Error rejecting candidate:', error);
      }
    );
  }
}
