import { StatusService } from './../../services/status.service';
import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-status',
  standalone: true,
  imports: [UpperCasePipe, PaginatorModule],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  status!: any;
  first: number = 0;
  totalRecord: number = 0;
  rows: number = 20;

  constructor(
    private StatusService: StatusService,
    private activatedRoute: ActivatedRoute,
    private router: Router, // Inject ChangeDetectorRef for manual change detection
  ) {}
  ngOnInit(): void {
     this.activatedRoute.queryParams.subscribe((params) => {
       const page = params['page'] ? +params['page'] : 1; // Convert page to number
       this.first = (page - 1) * this.rows;
       this.loadStatus(page);
     });


   
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    const myPage = (event.page || 0) + 1;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: myPage,
      },
      queryParamsHandling: 'merge',
    });
  }
  loadStatus(page:any){
     this.StatusService.status(page).subscribe(
       (res) => {
        if(res.results.length === 0){
          this.status=''
        }
        else{
          console.log(res);
          this.status = res.results;
          this.totalRecord = res.total;
          this.rows = res.limit;
        }
         
         
       },
       (err) => {
        console.log(err)
         if (err.error.message === 'Citizen does not have applications') {
           this.status = '';
           console.log(this.status);
         }
       },
     );
  }
}
