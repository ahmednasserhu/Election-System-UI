import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgModule,
} from '@angular/core';
import { Candidate } from '../../Interfaces/candidate';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../Services/candidate.service';
import { FilterByStatusPipe } from '../../Pips/filterbystatus.pipe';
import { ToastrService } from 'ngx-toastr';
import { Election } from '../../Interfaces/election';
import {
  DatePipe,
  LowerCasePipe,
  UpperCasePipe,
  CurrencyPipe,
  PercentPipe,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectionService } from '../../Services/election.service'; // Ensure this service exists and is correctly implemented
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    LowerCasePipe,
    UpperCasePipe,
    CurrencyPipe,
    PercentPipe,
    FilterByStatusPipe,
    NgxPaginationModule,
  ],
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css'],
})
export class CandidateComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  pendingCandidates: Candidate[] = [];
  approvedCandidates: Candidate[] = [];
  elections: Election[] = [];
  selectedCandidate: Candidate | undefined;
  rejectComment: string = '';
  page: number = 1;
  blockedPage: number = 1;
  searchTerm: string = '';
  @ViewChild('candidateModal') candidateModal: ElementRef | undefined;
  @ViewChild('rejectModal') rejectModal: ElementRef | undefined;

  constructor(
    private candidateService: CandidateService,
    private electionService: ElectionService, // Add ElectionService
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadCandidates();
    this.loadElections(); // Fetch elections on initialization
  }

  loadCandidates(): void {
    this.candidateService.getCandidates().subscribe(
      (data) => {
        this.candidates = data.paginationResults?.results || [];
        this.pendingCandidates = this.candidates.filter(
          (c) => c.status === 'pending',
        );
        this.approvedCandidates = this.candidates.filter(
          (c) => c.status === 'approved',
        );
        // Initially show pending candidates
        this.filteredCandidates = this.pendingCandidates.slice();
        
      },
      (error) => {
        console.error('Error loading candidates:', error);
      },
    );
  }

  loadElections(): void {
    this.electionService.getElections().subscribe(
      (data) => {
        this.elections = data;
      },
      (error) => {
        console.error('Error loading elections:', error);
      },
    );
  }

  getElectionTitle(electionId?: string): string {
    if (!electionId) {
      return 'Unknown Election';
    }
    const election = this.elections.find((e) => e._id === electionId);
    return election ? election.title : 'Unknown Election';
  }

  approveCandidate(candidate: Candidate): void {
    this.candidateService.approveCandidate(candidate._id).subscribe(
      () => {
        candidate.status = 'approved';
        this.pendingCandidates = this.pendingCandidates.filter(
          (c) => c._id !== candidate._id,
        );
        this.approvedCandidates.push(candidate);
        this.toastr.success(
          `Candidate '${candidate.logoName}' approved successfully.`,
        );
      },
      (error) => {
        console.error('Error approving candidate:', error);
        this.toastr.error(`Error approving candidate '${candidate.logoName}'.`);
      },
    );
  }

  openCandidateModal(candidate: Candidate): void {
    this.selectedCandidate = candidate;
    if (this.candidateModal) {
      (this.candidateModal.nativeElement as HTMLElement).classList.add('show');
      (this.candidateModal.nativeElement as HTMLElement).style.display =
        'block';
    }
  }

  closeCandidateModal(): void {
    if (this.candidateModal) {
      (this.candidateModal.nativeElement as HTMLElement).classList.remove(
        'show',
      );
      (this.candidateModal.nativeElement as HTMLElement).style.display = 'none';
    }
  }

  openRejectModal(candidate: Candidate): void {
    this.selectedCandidate = candidate;
    this.rejectComment = ''; // Reset comment field
    if (this.rejectModal) {
      (this.rejectModal.nativeElement as HTMLElement).classList.add('show');
      (this.rejectModal.nativeElement as HTMLElement).style.display = 'block';
    }
  }

  closeRejectModal(): void {
    if (this.rejectModal) {
      (this.rejectModal.nativeElement as HTMLElement).classList.remove('show');
      (this.rejectModal.nativeElement as HTMLElement).style.display = 'none';
    }
  }

  confirmRejectCandidate(): void {
    if (!this.rejectComment.trim()) {
      this.toastr.error('Please provide a rejection reason.');
      return;
    }

    if (this.selectedCandidate) {
      this.candidateService
        .rejectCandidate(this.selectedCandidate._id, this.rejectComment)
        .subscribe(
          () => {
            this.pendingCandidates = this.pendingCandidates.filter(
              (c) => c._id !== this.selectedCandidate!._id,
            );
            this.toastr.success(
              `Candidate '${this.selectedCandidate!.logoName}' rejected successfully.`,
            );
            this.closeRejectModal();
          },
          (error) => {
            console.error('Error rejecting candidate:', error);
            this.toastr.error(
              `Error rejecting candidate '${this.selectedCandidate!.logoName}'.`,
            );
          },
        );
    }
  }
  searchByLogoName(): void {
    if (this.searchTerm) {
      this.filteredCandidates = this.pendingCandidates.filter(candidate =>
        candidate.logoName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredCandidates = this.pendingCandidates.slice(); // Show all pending candidates if search term is empty
    }
  }
  
  

}
