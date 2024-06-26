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
import { Router, ActivatedRoute } from '@angular/router';
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
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

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
    PaginatorModule,
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
  searchTerm!: any;
  first: number = 0;
  totalRecord!: number;
  rows: number = 5;

  onSecondPageChange(event: PaginatorState) {
    this.first = event.first || 0;
    this.rows = event.rows || 5;
    const page = event.page ? event.page + 1 : 1;
    this.loadCandidates('approved', page);
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first || 0;
    this.rows = event.rows || 5;
    const page = event.page ? event.page + 1 : 1;
    this.loadCandidates( '',page);
  }

  @ViewChild('candidateModal') candidateModal: ElementRef | undefined;
  @ViewChild('rejectModal') rejectModal: ElementRef | undefined;

  constructor(
    private candidateService: CandidateService,
    private electionService: ElectionService, // Add ElectionService
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const status = params['status'];
      console.log(status);
      if (status === 'approved') {
        this.loadCandidates(status, 1);
      } else {
        this.loadCandidates(status, 1);
      }
    });
    // this.loadElections(); // Fetch elections on initialization
  }

  navigateToApprovedCandidates(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status: 'approved' },
      queryParamsHandling: 'merge', // merge with existing query params
    });
  }

  navigateToCandidate(): void {
    this.router.navigate(['admin', 'candidate']);
  }

  loadCandidates(status: any, page: any): void {
    this.candidateService.getCandidates(status, page).subscribe(
      (data) => {
        this.candidates = data.paginationResults?.results || [];
        console.log(data);
        this.totalRecord = data.paginationResults.total;
        // this.pendingCandidates = this.candidates.filter(
        //   (c) => c.status === 'pending',
        // );
        // this.approvedCandidates = this.candidates.filter(
        //   (c) => c.status === 'approved',
        // );
        // this.filteredCandidates = this.pendingCandidates.slice();
        this.filteredCandidates = data.paginationResults.results
        this.pendingCandidates = data.paginationResults.results;
      },
      (error) => {
        console.error('Error loading candidates:', error);
      },
    );
  }

  loadElections(page: number, limit: number): void {
    this.electionService.getElections(page, limit).subscribe({
      next: (response) => {
        if (response && Array.isArray(response.results)) {
          this.elections = response.results;
          // this.totalPages = response.totalPages;
          // this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        } else {
          console.error('Data is not in the expected format', response);
        }
      },
      error: (err) => {
        console.error('Error fetching elections:', err);
      },
    });
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
    console.log(this.pendingCandidates);
    if (this.searchTerm) {
      this.filteredCandidates = this.pendingCandidates.filter((candidate) =>
        candidate.logoName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()),
      );
    } else {
      this.filteredCandidates = this.pendingCandidates.slice(); // Show all pending candidates if search term is empty
    }
  }
}
