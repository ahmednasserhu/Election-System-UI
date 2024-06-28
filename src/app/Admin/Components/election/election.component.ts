import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectionService } from '../../Services/election.service';
import { Election } from '../../Interfaces/election';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-election',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.css'],
})
export class ElectionComponent implements OnInit {
  @ViewChild('addElectionForm') addElectionForm!: NgForm;
  elections: Election[] = [];
  selectedElection: Election = this.initializeElection();
  newElection: Election = this.initializeElection();
  deleteElectionId: string | null = null;
  dateError: string | null = null; 
  endDateError: string | null = null; 

  constructor(private electionService: ElectionService, private toastr: ToastrService) {}

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
      totalVotes: 0,
    };
  }

  loadElections(): void {
    this.electionService.getElections().subscribe((data) => (this.elections = data));
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
          this.toastr.success('Election Deleted successfully');

        },
        error: (err) => console.error('Delete error', err),
      });
    }
  }

  saveElection(): void {
    if (!this.newElection.title && !this.newElection.description && !this.newElection.startdate && !this.newElection.enddate) {
      this.toastr.error('All fields are required.', 'Validation Error');
      return;
    }
  
    if (!this.newElection.title || !this.newElection.description || !this.newElection.startdate || !this.newElection.enddate) {
      this.toastr.error('Please fill in all fields.', 'Validation Error');
      return;
    }

    this.dateError = null; 
    this.endDateError = null; 
    this.electionService.createElection(this.newElection).subscribe({
      next: () => {
        this.loadElections();
        this.clearNewElectionForm();
        this.toastr.success('Election created successfully.');
      },
      error: (err) => {
        if (err.error.message) {
          this.handleServerError(err.error.message);
        } else {
          this.toastr.error('Failed to create election.');
        }
      },
    });
  }

  saveEditedElection(): void {
    this.dateError = null; 
    this.endDateError = null; 
    this.electionService.updateElection(this.selectedElection).subscribe({
      next: () => {
        this.loadElections();
        this.clearSelectedElectionForm();
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal')!);
        editModal?.hide();
        this.toastr.success('Election Edited successfully');

      },
      error: (err) => {
        if (err.error.message) {
          this.toastr.success('Election Failed to be Edited');
          this.handleServerError(err.error.message);
        } else {
          console.error('Update error', err);
        }
      },
    });
  }


  clearNewElectionForm(): void {
    this.newElection = this.initializeElection();
    if (this.addElectionForm) {
      this.addElectionForm.resetForm(); 
    }
  }

  clearSelectedElectionForm(): void {
    this.selectedElection = this.initializeElection();
    this.dateError = null; 
    this.endDateError = null; 
  }

  handleServerError(errorMessage: string): void {
    if (errorMessage.includes('Start date must be at least one day after the current date.')) {
      this.dateError = errorMessage;
    } else if (errorMessage.includes('End date must be at least one day after the start date.')) {
      this.endDateError = errorMessage;
    } else {
      this.toastr.error(errorMessage);
    }
  }
}
