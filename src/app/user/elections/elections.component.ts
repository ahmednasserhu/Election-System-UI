import { ActivatedRoute } from '@angular/router';
import { ElectionService } from './../../services/election.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ElectionCardComponent } from '../election-card/election-card.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, DatePipe, ElectionCardComponent, NgxSpinnerModule],
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.css'],
})
export class ElectionsComponent implements OnInit {
  results!: any;
  private routeSubscription: any; // Variable to hold the subscription
  errorMessage: string = '';
  dataCame = false;
  status!: any;
  constructor(
    private _ElectionService: ElectionService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef for manual change detection
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.dataCame=false
      status = params['status'] || '';
      console.log(status);
      this._ElectionService.getStatusElection(status).subscribe(
        (res) => {
          this.dataCame = true;
          console.log(res);
          // this.results = res;
          if (status === 'finished') {
            this.results = res.filter(
              (res: any) => res.candidates.length !== 0,
            );
          } else if (status === 'pending') {
            this.results = res;
          } else if (status === 'in-progress') {
            this.results = res.filter(
              (res: any) =>
                res.candidates.length !== 0 && res.candidates.length !== 1,
            );
          }
          this.spinner.hide();
          this.cdr.detectChanges(); // Manually trigger change detection
        },
        (error) => {
          this.errorMessage = error;
          this.spinner.hide();
          this.dataCame = true;
          this.cdr.detectChanges(); // Manually trigger change detection
        },
      );
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from the route subscription to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
