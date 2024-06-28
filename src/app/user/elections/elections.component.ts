import { ActivatedRoute } from '@angular/router';
import { ElectionService } from './../../services/election.service';
import { Component, OnInit } from '@angular/core';
import { ElectionCardComponent } from '../election-card/election-card.component';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [DatePipe, ElectionCardComponent],
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.css'],
})
export class ElectionsComponent implements OnInit {
  results!: any;
  errorMessage: string = '';
  status !: any
  constructor(
    private _ElectionService: ElectionService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
       status = params['status'] || '';
      console.log(status);
      this._ElectionService.getStatusElection(status).subscribe(
        (res) => {
          console.log(res);
          // this.results = res;
          if (status === 'finished') {
            this.results = res.filter(
              (res: any) => res.candidates.length !== 0,
            );
          }
          else if (status === 'pending') {
            this.results = res
          }
          else if (status === 'in-progress') {
            this.results = res.filter(
              (res: any) =>
                res.candidates.length !== 0 && res.candidates.length !== 1,
            );
          }
        },
        (error) => {
          this.errorMessage = error;
        },
      );
    });
  }
}
