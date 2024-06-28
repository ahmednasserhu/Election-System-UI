import { ActivatedRoute } from '@angular/router';
import { ElectionService } from './../../services/election.service';
import { Component, OnInit } from '@angular/core';
import { ElectionCardComponent } from '../election-card/election-card.component';
import { Election } from '../../interface/election';
import { CommonModule, DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Result } from '../../interface/result';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [DatePipe, ElectionCardComponent],
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.css'],
})
export class ElectionsComponent implements OnInit {
  // elections!: Election[];
  results!: any;
  errorMessage: string = '';

  constructor(private _ElectionService: ElectionService, private activatedRoute:ActivatedRoute) {}
  ngOnInit(): void {
    let status = ''
    this.activatedRoute.queryParams.subscribe((params) => {
       status = params['status'];
    });
    status = status !== undefined ? status : ''
    console.log(status)
    this._ElectionService.getStatusElection(status).subscribe((res) => {
      console.log(res);
      this.results = res;
    });
  }
}
