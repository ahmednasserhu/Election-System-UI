import { ElectionService } from './../services/election.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-details.component.html',
  styleUrls: ['./home-details.component.css'],
})
export class HomeDetailsComponent implements OnInit {
  election?: any;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const electionId = params['id'];
      this.electionService.getSpecificElection(electionId).subscribe(
        (election) => {
          this.election = election;
          console.log('Election data:', this.election); // Log the data
        },
        (error) => {
          console.error('Error fetching election:', error); // Log any errors
        }
      );
    });
  }
  
}
