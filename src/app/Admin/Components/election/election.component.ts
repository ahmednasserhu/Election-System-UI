import { Component, OnInit } from '@angular/core';
import { ElectionService } from '../../Services/election.service';
import { Election } from '../../Interfaces/election'
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule  } from '@angular/common/http';
import { FormsModule ,NgForm , FormBuilder,FormControl} from '@angular/forms';


@Component({
  selector: 'app-election',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './election.component.html',
  styleUrl: './election.component.css'
})
export class ElectionComponent implements OnInit {
  elections: Election[] = [];
  selectedElection: Election = {id:0, title: '', description: '', startdate: '', enddate: '', candidates: [], totalVotes: 0 };

  constructor(private electionService: ElectionService) { }

  ngOnInit(): void {
    this.loadElections();
  }

  loadElections(): void {
    this.electionService.getElections().subscribe(data => this.elections = data);
  }

  editElection(election: Election): void {
    this.selectedElection.id = election.id!;
    this.selectedElection = { ...election };
    // Some logic to edit the election
  }
  
  deleteElection(id: number): void {
    if (confirm('Are you sure you want to delete this election?')) {
      this.electionService.deleteElection(id).subscribe(() => this.loadElections());
    }
  }

  saveElection(): void {
    if (this.selectedElection.id) {
      this.electionService.updateElection(this.selectedElection).subscribe(() => {
        this.loadElections();
        this.clearForm();
        this.switchTab('election-list-tab');
      });
    } else {
      this.electionService.createElection(this.selectedElection).subscribe(() => {
        this.loadElections();
        this.clearForm();
        this.switchTab('election-list-tab');
      });
    }
  }

  clearForm(): void {
    this.selectedElection = { id:0,title: '', description: '', startdate: '', enddate: '', candidates: [], totalVotes: 0 };
  }

  switchTab(tabId: string): void {
    const tab = new bootstrap.Tab(document.getElementById(tabId) as HTMLElement);
    tab.show();
  }
}
