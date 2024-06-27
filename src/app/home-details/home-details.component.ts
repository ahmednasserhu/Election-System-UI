import { ElectionService } from './../services/election.service';
import { Component, OnInit } from '@angular/core';
import { Election } from '../Admin/Interfaces/election';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-details.component.html',
  styleUrl: './home-details.component.css',
})
export class HomeDetailsComponent implements OnInit {
  election?: any;

  constructor(
    private route: ActivatedRoute,
    private ElectionService: ElectionService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const electionId = params['id'];
      this.ElectionService.getSpecificElection(electionId).subscribe(
        (election) => {
          this.election = election;
          console.log(this.election);
        },
      );
    });
  }
}
