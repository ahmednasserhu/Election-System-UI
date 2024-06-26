import { Component, OnInit } from '@angular/core';
import { ElectionService } from '../../Services/election.service';
import { Election } from '../../Interfaces/election';
import { Election } from '../../Interfaces/election';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-election',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './election.component.html',
  styleUrl: './election.component.css',
})
export class ElectionComponent implements OnInit {
  elections: Election[] = [];
  selectedElection: Election = this.initializeElection();
  newElection: Election = this.initializeElection();
  deleteElectionId: string | null = null;

  constructor(private electionService: ElectionService) {}

  ngOnInit(): void {
    this.loadElections();
  }

  initializeElection(): Election {
    return {
      _id: '',
      title: '',
      description: '',
      startdate: '',
      enddate: '',
      candidates: [],
      totalVotes: 0
    };
  }

  loadElections(): void {
    this.electionService
      .getElections()
      .subscribe((data) => (this.elections = data));
  }

  editElection(election: Election): void {
    this.selectedElection = { ...election };
    const editModal = new bootstrap.Modal(document.getElementById('editModal')!);
    editModal.show();
  }

  deleteElection(id: string): void {
    this.deleteElectionId = id;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal')!);
    deleteModal.show();
  }

  confirmDelete(): void {
    if (this.deleteElectionId) {
      this.electionService.deleteElection(this.deleteElectionId).subscribe({
        next: () => {
          this.loadElections();
          this.deleteElectionId = null;
          const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal')!);
          deleteModal?.hide();
        },
        error: err => console.error('Delete error', err)
      });
    }
  }

  saveElection(): void {
    if (this.newElection.title && this.newElection.description) {
      this.electionService.createElection(this.newElection).subscribe({
        next: () => {
          this.loadElections();
          this.clearNewElectionForm();
        },
        error: err => console.error('Create error', err)
      });
    } else {
      console.error('Validation error: Title and Description are required.');
    }
  }

  saveEditedElection(): void {
    if (this.selectedElection.title && this.selectedElection.description) {
      this.electionService.updateElection(this.selectedElection).subscribe({
        next: () => {
          this.loadElections();
          this.clearSelectedElectionForm();
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal')!);
          editModal?.hide();
        },
        error: err => console.error('Update error', err)
      });
    } else {
      console.error('Validation error: Title and Description are required.');
    }
  }

  clearNewElectionForm(): void {
    this.newElection = this.initializeElection();
  }

  clearSelectedElectionForm(): void {
    this.selectedElection = this.initializeElection();
  }
}
