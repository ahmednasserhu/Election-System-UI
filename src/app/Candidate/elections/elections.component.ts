import { Component, OnInit } from '@angular/core';
import { CandidateNavBarComponent } from '../candidate-nav-bar/candidate-nav-bar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ElectionService } from '../../services/election.service';
import { PaginatorModule } from 'primeng/paginator';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

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
    CandidateNavBarComponent,
    CommonModule,
    NgxSpinnerModule,
    DatePipe,
    PaginatorModule,
  ],
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.css'],
})
export class CandidateElections implements OnInit {
  elections : any;
  loading: boolean = false;
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10; // Number of items per page

  constructor(
    private electionService: ElectionService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadElections({ first: this.first, rows: this.rows, page: 0, pageCount: 0 });
  }

  loadElections(event: PageEvent) {
    this.loading = true;
    this.spinner.show();
    const page = (event.first / event.rows) + 1; // Calculate the page number based on the first and rows values
    this.electionService.getCandidateElections(page, event.rows).subscribe(
      (res) => {
        this.elections = res.results;
        this.totalRecords = res.total;
        this.loading = false;
        console.log(res)
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching elections:', error);
        this.loading = false;
        this.spinner.hide();
      }
    );
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadElections(event);
  }

  vote(id:any) {
    this.router.navigate(['/user/election-details', id]);
  }
}
