import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VoteService } from '../../Services/vote.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentDate = new Date();
  totalVoters = 120000;
  registeredCandidates = 150;
  votesCast = 11;
  pendingIssues = 24;
  recentActivities = [
    { timestamp: new Date(), description: 'Candidate A registered' },
    { timestamp: new Date(), description: 'Voter turnout update posted' },
    { timestamp: new Date(), description: 'New voting center added' }
  ];
  constructor(private voteService: VoteService) { }
 
  fetchTotalVotes(): void {
    this.voteService.getTotalVotes().subscribe(response => {
      this.votesCast = response.total;
      console.log(response);
      
    });
  }
  
}
