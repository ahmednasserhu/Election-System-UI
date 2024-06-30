import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectionService } from '../../Services/election.service';
import { Election } from '../../Interfaces/election';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-election',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.css'],
})
export class ElectionComponent implements OnInit {
  @ViewChild('editForm') editForm!: NgForm;
  @ViewChild('addElectionForm') addElectionForm!: NgForm;
  elections: Election[] = [];
  selectedElection: Election = this.initializeElection();
  newElection: Election = this.initializeElection();
  deleteElectionId: string | null = null;
  duplicateTitleError: string | null = null;
  startDateError: string | null = null;
  endDateError: string | null = null;
  page: number = 1;
  blockedPage: number = 1;

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
    this.electionService.getElections().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.elections = data;
        } else {
          console.error('Data is not an array', data);
        }
      },
      error: (err) => {
        console.error('Error fetching elections:', err);
      },
    });
  }
  
  
  
  editElection(election: Election): void {
    // Make a copy of the election object to avoid mutating the original
    this.selectedElection = { ...election };
  
    // Convert dates to proper format (YYYY-MM-DD) if they are not already formatted
    if (this.selectedElection.startdate) {
      this.selectedElection.startdate = new Date(this.selectedElection.startdate).toISOString().split('T')[0];
    }
    if (this.selectedElection.enddate) {
      this.selectedElection.enddate = new Date(this.selectedElection.enddate).toISOString().split('T')[0];
    }
  
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
          this.toastr.success('Election deleted successfully.');
        },
        error: (err) => {
          console.error('Delete error', err);
          this.toastr.error('Failed to delete election.');
        },
      });
    }
  }

  saveElection(): void {
    this.validateNewElectionDates(); 
    if (!this.newElection.title && !this.newElection.description && !this.newElection.startdate && !this.newElection.enddate) {
      this.toastr.error('All fields are required.', 'Validation Error');
      return;
    }

    if (!this.newElection.title || !this.newElection.description || !this.newElection.startdate || !this.newElection.enddate) {
      this.toastr.error('Please fill in all fields.', 'Validation Error');
      return;
    }

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
    if (!this.selectedElection.title || !this.selectedElection.description || !this.selectedElection.startdate || !this.selectedElection.enddate) {
      this.toastr.error('Please fill in all fields.', 'Validation Error');
      return;
    }

    this.electionService.updateElection(this.selectedElection).subscribe({
      next: () => {
        this.loadElections();
        this.clearSelectedElectionForm();
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal')!);
        editModal?.hide();
        this.toastr.success('Election updated successfully.');
      },
      error: (err) => {
        if (err.error.message) {
          this.handleServerError(err.error.message);
        } else {
          this.toastr.error('Failed to update election.');
        }
      },
    });
  }
  validateNewElectionDates(): void {
    const startDate = new Date(this.newElection.startdate);
    const endDate = new Date(this.newElection.enddate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (startDate <= today ) {
      this.startDateError = 'Start date must be at least one day after today.';
    } else {
      this.startDateError = null;
    }
  
    if (endDate <= startDate) {
      this.endDateError = 'End date must be at least one day after the start date.';
    } else {
      this.endDateError = null;
    }
  }
  
  validateDates(): void {
    const startDate = new Date(this.selectedElection.startdate);
    const endDate = new Date(this.selectedElection.enddate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight
  
    // Check if the start date is at least one day after today
    this.startDateError = startDate <= new Date(today.getTime() + 24 * 60 * 60 * 1000) ? 'Start date must be at least one day after today.' : null;
    
    this.endDateError = endDate <= startDate ? 'End date must be at least one day after the start date.' : null;
  }
  

  checkDuplicateTitle(title: string): void {
    this.duplicateTitleError = this.elections.some(e => e.title === title && e._id !== this.selectedElection._id)
      ? 'An election with this title already exists.'
      : null;
  }

  clearNewElectionForm(): void {
    this.newElection = this.initializeElection();
    this.startDateError = null; 
    this.endDateError = null; 
    if (this.addElectionForm) {
      this.addElectionForm.resetForm(); 
    }
  }

  clearSelectedElectionForm(): void {
    this.selectedElection = this.initializeElection();
    this.duplicateTitleError = null;
    this.startDateError = null;
    this.endDateError = null;
    if (this.editForm) {
      this.editForm.resetForm(); 
    }
  }

  handleServerError(errorMessage: string): void {
    if (errorMessage.includes('duplicate key error')) {
      this.duplicateTitleError = 'An election with this title already exists.';
    } else if (errorMessage.includes('Start date must be at least one day after the current date.')) {
      this.startDateError = errorMessage;
    } else if (errorMessage.includes('End date must be at least one day after the start date.')) {
      this.endDateError = errorMessage;
    } else {
      this.toastr.error(errorMessage);
    }
  }
}
