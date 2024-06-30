import { Component, OnInit } from '@angular/core';
import { Citizen } from '../../Interfaces/citizen';
import { CitizenService } from '../../Services/citizen.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-citizen',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule,ReactiveFormsModule,FormsModule],
  templateUrl: './citizen.component.html',
  styleUrls: ['./citizen.component.css'],
})
export class CitizenComponent implements OnInit {
  citizens: Citizen[] = [];
  filteredCitizens: Citizen[] = [];
  blockedCitizens: Citizen[] = [];
  error: string = '';
  searchTerm: string = ''; // Holds the SSN to search for
  page: number = 1; // Current page for citizens
  blockedPage: number = 1; // Current page for blocked citizens
  itemsPerPage: number = 5;

  constructor(private citizenService: CitizenService) {}

  ngOnInit(): void {
    this.loadCitizens();
    this.loadBlockedCitizens();
  }

  loadCitizens(): void {
    this.citizenService.getCitizens().subscribe(
      (data) => {
        this.citizens = data.filter((citizen) => citizen.status !== 'blocked');
        this.filteredCitizens = this.citizens; // Initialize the filtered list
      },
      (error) => {
        this.error = 'Error loading citizens: ' + error.message;
        console.error('Error loading citizens:', error);
      },
    );
  }

  loadBlockedCitizens(): void {
    this.citizenService.getCitizens().subscribe(
      (data) => {
        this.blockedCitizens = data.filter(
          (citizen) => citizen.status === 'blocked',
        );
      },
      (error) => {
        this.error = 'Error loading blocked citizens: ' + error.message;
        console.error('Error loading blocked citizens:', error);
      },
    );
  }

  blockCitizen(citizen: Citizen, action: 'blocked' | 'unblocked'): void {
    let statusToUpdate: string = '';

    if (action === 'blocked') {
      statusToUpdate = 'blocked';
    } else if (action === 'unblocked') {
      statusToUpdate = 'unblocked';
    } else {
      return;
    }

    this.citizenService
      .updateCitizenStatus(citizen._id, statusToUpdate)
      .subscribe(
        () => {
          citizen.status = statusToUpdate;
          if (statusToUpdate === 'blocked') {
            this.citizens = this.citizens.filter((c) => c._id !== citizen._id);
            this.filteredCitizens = this.filteredCitizens.filter((c) => c._id !== citizen._id);
            this.blockedCitizens.push(citizen);
          } else if (statusToUpdate === 'unblocked') {
            this.blockedCitizens = this.blockedCitizens.filter(
              (c) => c._id !== citizen._id,
            );
            this.citizens.push(citizen);
            this.filteredCitizens.push(citizen);
          }
        },
        (error) => {
          this.error = `Error ${action.toLowerCase()} citizen: ${error.message}`;
          console.error(`Error ${action.toLowerCase()} citizen:`, error);
        },
      );
  }

  searchBySSN(): void {
    if (this.searchTerm) {
      this.filteredCitizens = this.citizens.filter(citizen => 
        citizen.ssn.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredCitizens = this.citizens; // Show all if search term is empty
    }
  }
}
