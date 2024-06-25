import { Component, OnInit } from '@angular/core';
import { VoteService } from '../../Services/vote.service';
import { CandidateService } from '../../Services/candidate.service';
import { ElectionService } from '../../Services/election.service';
import { CitizenService } from '../../Services/citizen.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentDate = new Date();
  totalVoters = 0;
  registeredCandidates = 0;
  votesCast = 0;
  recentActivities: { timestamp: Date, description: string }[] = [];

  constructor(
    private voteService: VoteService,
    private candidateService: CandidateService,
    private electionService: ElectionService,
    private citizenService: CitizenService
  ) { }

  ngOnInit(): void {
    this.fetchTotalCandidates();
    this.fetchTotalVotes();
    this.fetchTotalCitizens();
    this.fetchRecentActivities();
  }

  fetchTotalVotes(): void {
    this.voteService.getTotalVotes().subscribe(response => {
      console.log('Total Votes:', response);
      this.votesCast = response.total;
    }, error => {
      console.error('Error fetching total votes:', error);
    });
  }

  fetchTotalCandidates(): void {
    this.candidateService.getCandidates().subscribe(response => {
      console.log('Total Candidates:', response);
      this.registeredCandidates = response.length;
    }, error => {
      console.error('Error fetching candidates:', error);
    });
  }

  fetchTotalCitizens(): void {
    this.citizenService.getTotalCitizen().subscribe(response => {
      console.log('Total Citizens:', response);
      this.totalVoters = response.length;
    }, error => {
      console.error('Error fetching total citizens:', error);
    });
  }

  fetchRecentActivities(): void {
    this.candidateService.getLastCandidate().subscribe(candidate => {
      console.log('Last Candidate:', candidate);
      if (candidate.timestamp) {
        const timestamp = new Date(candidate.timestamp);
        if (!isNaN(timestamp.getTime())) {
          this.recentActivities.push({
            timestamp,
            description: `Candidate ${candidate.name} registered`
          });
        }
      }
    }, error => {
      console.error('Error fetching last candidate:', error);
    });

    this.voteService.getLastVote().subscribe(vote => {
      console.log('Last Vote:', vote);
      if (vote.timestamp) {
        const timestamp = new Date(vote.timestamp);
        if (!isNaN(timestamp.getTime())) {
          this.recentActivities.push({
            timestamp,
            description: `Vote cast by ${vote.voterName}`
          });
        }
      }
    }, error => {
      console.error('Error fetching last vote:', error);
    });

    this.electionService.getLastElection().subscribe(election => {
      console.log('Last Election:', election);
      if (election.timestamp) {
        const timestamp = new Date(election.timestamp);
        if (!isNaN(timestamp.getTime())) {
          this.recentActivities.push({
            timestamp,
            description: `Election ${election.name} was held`
          });
        }
      }
    }, error => {
      console.error('Error fetching last election:', error);
    });
  }
}
