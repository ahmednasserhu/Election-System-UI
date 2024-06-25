import { Component, OnInit } from '@angular/core';
import { ElectionService } from '../../Services/election.service';
import { Election } from '../../Interfaces/election';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-election',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './election.component.html',
  styleUrl: './election.component.css'
})
export class ElectionComponent implements OnInit {
  elections: Election[] = [];
  selectedElection: Election = {
    _id: '',
    title: '',
    description: '',
    startdate: '',
    enddate: '',
    candidates: [],
    totalVotes: 0
  };
  deleteElectionId: string | null = null;

  constructor(private electionService: ElectionService) { }

  ngOnInit(): void {
    this.loadElections();
  }

  loadElections(): void {
    this.electionService.getElections().subscribe(data => this.elections = data);
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
    if (this.selectedElection._id) {
      this.electionService.updateElection(this.selectedElection).subscribe({
        next: () => {
          this.loadElections();
          this.clearForm();
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal')!);
          editModal?.hide();
        },
        error: err => console.error('Update error', err)
      });
    } else {
      this.electionService.createElection(this.selectedElection).subscribe({
        next: () => {
          this.loadElections();
          this.clearForm();
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal')!);
          editModal?.hide();
        },
        error: err => console.error('Create error', err)
      });
    }
  }

  clearForm(): void {
    this.selectedElection = {
      _id: '',
      title: '',
      description: '',
      startdate: '',
      enddate: '',
      candidates: [],
      totalVotes: 0
    };
  }
}
