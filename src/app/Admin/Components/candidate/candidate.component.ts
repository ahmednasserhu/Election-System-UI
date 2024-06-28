import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Candidate } from '../../Interfaces/candidate';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../Services/candidate.service';
import { FilterByStatusPipe } from '../../Pips/filterbystatus.pipe';
import { ToastrService } from 'ngx-toastr';
import {
  DatePipe,
  LowerCasePipe,
  UpperCasePipe,
  CurrencyPipe,
  PercentPipe,
} from '@angular/common';

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
    FilterByStatusPipe,
  ],
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css'],
})
export class CandidateComponent implements OnInit {
  candidates: Candidate[] = [];
  pendingCandidates: Candidate[] = [];
  approvedCandidates: Candidate[] = [];
  selectedCandidate: Candidate | undefined;


  @ViewChild('candidateModal') candidateModal: ElementRef | undefined;
  constructor(private candidateService: CandidateService ,private toastr: ToastrService) {}



  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.candidateService.getCandidates().subscribe(
      (data) => {
        this.candidates = data.paginationResults?.results || [];
        this.pendingCandidates = this.candidates.filter(c => c.status === 'pending');
        this.approvedCandidates = this.candidates.filter(c => c.status === 'approved');
      },
      (error) => {
        console.error('Error loading candidates:', error);
      },
    );
  }

  approveCandidate(candidate: Candidate): void {
    // Assuming approveCandidate is a method on the service that updates candidate status
    this.candidateService.approveCandidate(candidate._id).subscribe(
      () => {
        candidate.status = 'approved';
        this.pendingCandidates = this.pendingCandidates.filter(c => c._id !== candidate._id);
        this.approvedCandidates.push(candidate);
        this.toastr.success(`Candidate '${candidate.logoName}' approved successfully.`);
      },
      (error) => {
        console.error('Error approving candidate:', error);
      },
    );
  }

  rejectCandidate(candidate: Candidate): void {
    this.candidateService.rejectCandidate(candidate._id).subscribe(
      () => {
        this.pendingCandidates = this.pendingCandidates.filter(c => c._id !== candidate._id);
        this.toastr.success(`Candidate '${candidate.logoName}' rejected .`);
      },
      (error) => {
        console.error('Error rejecting candidate:', error);
      },
    );
  }

  openCandidateModal(candidate: Candidate): void {
    this.selectedCandidate = candidate;
    if (this.candidateModal) {
      // Open Bootstrap modal
      (this.candidateModal.nativeElement as HTMLElement).classList.add('show');
      (this.candidateModal.nativeElement as HTMLElement).style.display = 'block';
    }
  }

  closeCandidateModal(): void {
    if (this.candidateModal) {
      // Close Bootstrap modal
      (this.candidateModal.nativeElement as HTMLElement).classList.remove('show');
      (this.candidateModal.nativeElement as HTMLElement).style.display = 'none';
    }
  }
}
