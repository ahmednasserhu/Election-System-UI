import { Component, OnInit } from '@angular/core';
import { VoteService } from '../../Services/vote.service';
import { CandidateService } from '../../Services/candidate.service';
import { ElectionService } from '../../Services/election.service';
import { CitizenService } from '../../Services/citizen.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  currentDate = new Date();
  totalVoters = 0;
  registeredCandidates = 0;
  votesCast = 0;
  recentActivities: { timestamp: Date, description: SafeHtml }[] = [];

  constructor(
    private voteService: VoteService,
    private candidateService: CandidateService,
    private electionService: ElectionService,
    private citizenService: CitizenService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.fetchTotalCandidates();
    this.fetchTotalVotes();
    this.fetchTotalCitizens();
    this.fetchRecentActivities();
  }

  fetchTotalVotes(): void {
    this.voteService.getTotalVotes().subscribe(
      (response) => {
        console.log('Total Votes:', response);
        this.votesCast = response.total;
      },
      (error) => {
        console.error('Error fetching total votes:', error);
      },
    );
  }

  fetchTotalCandidates(): void {
    this.candidateService.getCandidates().subscribe(response => {
      console.log('Total Candidates:', response);
      this.registeredCandidates = response.paginationResults.total;
    }, error => {
      console.error('Error fetching candidates:', error);
    });
  }

  fetchTotalCitizens(): void {
    this.citizenService.getCitizenss().subscribe(response => {
      console.log('Total Citizens:', response);
      this.totalVoters = response.paginationResults.total;
    }, error => {
      console.error('Error fetching total citizens:', error);
    });
  }

  fetchRecentActivities(): void {
    this.candidateService.getLastCandidate().subscribe(candidateResponse => {
      console.log('Last Candidate:', candidateResponse);
      const lastCandidate = candidateResponse.lastApplication;
      if (lastCandidate && lastCandidate.requestedAt) {
        const timestamp = new Date(lastCandidate.requestedAt);
        if (!isNaN(timestamp.getTime())) {
          const description = this.sanitizer.bypassSecurityTrustHtml(
            `Candidate <span style="color: rgb(233, 199, 154);">${lastCandidate.citizenId.firstName} ${lastCandidate.citizenId.lastName}</span> registered for the <span style="color: tomato;">${lastCandidate.electionId.title}</span> election`
          );
          this.recentActivities.push({ timestamp, description });
        }
      }
    }, error => {
      console.error('Error fetching last candidate:', error);
    });

    this.voteService.getLastVote().subscribe(voteResponse => {
      console.log('Last Vote:', voteResponse);
      const lastVote = voteResponse.lastVote;
    
      if (lastVote && lastVote.createdAt) {
        const timestamp = new Date(lastVote.createdAt);
        if (!isNaN(timestamp.getTime())) {
          const description = this.sanitizer.bypassSecurityTrustHtml(
            `Vote cast by <span style="color: rgb(233, 199, 154);">${lastVote.citizenId.firstName} ${lastVote.citizenId.lastName}</span> in the <span style="color: tomato;">${lastVote.electionId.title}</span> election`
          );
          this.recentActivities.push({ timestamp, description });
        }
      }
    }, error => {
      console.error('Error fetching last vote:', error);
    });
    
    this.electionService.getLastElection().subscribe(electionResponse => {
      console.log('Last Election:', electionResponse);
      const lastElection = electionResponse.lastApplication;
      if (lastElection && lastElection.createdAt) {
        const timestamp = new Date(lastElection.createdAt);
        if (!isNaN(timestamp.getTime())) {
          const description = this.sanitizer.bypassSecurityTrustHtml(
            `Election <span style="color: tomato;">${lastElection.title}</span> was held`
          );
          this.recentActivities.push({ timestamp, description });
        }
      }
    }, error => {
      console.error('Error fetching last election:', error);
    });
  }
}
