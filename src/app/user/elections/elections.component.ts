import { ActivatedRoute, Router } from '@angular/router';
import { ElectionService } from './../../services/election.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ElectionCardComponent } from '../election-card/election-card.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { UserProfileService } from '../../services/user-profile.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ElectionCardComponent,
    NgxSpinnerModule,
    PaginatorModule,
  ],
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.css'],
})
export class ElectionsComponent implements OnInit {
  first: number = 0;
  totalRecord: number = 0;
  rows: number = 20;

  results!: any;
  private routeSubscription: any; // Variable to hold the subscription
  errorMessage: string = '';
  dataCame = false;
  status!: any;
  constructor(
    private _ElectionService: ElectionService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private userProfileService: UserProfileService,
    private router: Router, // Inject ChangeDetectorRef for manual change detection
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.dataCame = false;
      this.status = params['status'] || '';
      const page = params['page'] ? +params['page'] : 1; // Convert page to number
      this.first = (page - 1) * this.rows;
      this.loadElections(page);
    });
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    const myPage = (event.page || 0) + 1;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        status: this.status,
        page: myPage,
      },
      queryParamsHandling: 'merge',
    });
  }

  loadElections(page: number) {
    const token = localStorage.getItem('token');
  
    if (token) {
        const decodedToken: any = jwtDecode(token);
        console.log(decodedToken);
        const citizenId = decodedToken?.citizen?._id;
        if (citizenId) {
          this.userProfileService.getProfile(citizenId).subscribe((profile: any) => {
            this.loadElectionData(page);
          }, (error: HttpErrorResponse) => {
            console.error('Error fetching profile:', error);
            if (error.status === 403 && error.error.message === 'Your account is blocked.') {
              Swal.fire({
                title: 'Your account is blocked.',
                icon: 'error',
              }).then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                this.router.navigate(['/login']);
              });
            }
          });
        } else {
          this.loadElectionData(page);
        }
    } else {
      this.loadElectionData(page);
    }
  }

  private loadElectionData(page: number) {
    this.spinner.show();
    this._ElectionService.getStatusElection(this.status, page).subscribe(
      (res) => {
        console.log(res);
        this.totalRecord = res.total;
        this.rows = res.limit;
        this.results = res.results;
        this.dataCame = true;

        // Filter results based on status
        if (this.status === 'finished') {
          this.results = this.results.filter(
            (result: any) => result.candidates.length !== 0
          );
        } else if (this.status === 'in-progress') {
          this.results = this.results.filter(
            (result: any) =>
              result.candidates.length !== 0 && result.candidates.length !== 1
          );
        }

        this.spinner.hide();
        this.cdr.detectChanges();
      }
    );
  }


  ngOnDestroy(): void {
    // Unsubscribe from the route subscription to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
