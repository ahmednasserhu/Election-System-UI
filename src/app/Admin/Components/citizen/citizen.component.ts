import { PaginatedResponse } from './../../Interfaces/election';
import { Component, OnInit } from '@angular/core';
import { Citizen } from '../../Interfaces/citizen';
import { CitizenService } from '../../Services/citizen.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-citizen',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorModule,
  ],
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
  first: number = 0;
  totalRecord!: number;
  rows: number = 10;
  totalRecord2 !: number;
  constructor(private citizenService: CitizenService) {}

  ngOnInit(): void {
    this.loadCitizens(1);
    this.loadBlockedCitizens(1);
  }

  loadCitizens(page = 1): void {

    this.citizenService.getCitizens('', page).subscribe(
      (data) => {
        console.log(data);
        this.citizens = data.paginationResults.results;
        this.totalRecord2 = data.paginationResults.total;
        // this.citizens = data.filter((citizen:any) => citizen.status !== 'blocked');
        // this.filteredCitizens = this.citizens; // Initialize the filtered list
        console.log(data.paginationResults.results);
        this.filteredCitizens = data.paginationResults.results;
      },
      (error) => {
        this.error = 'Error loading citizens: ' + error.message;
        console.error('Error loading citizens:', error);
      },
    );
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first || 0;
    this.rows = event.rows || 5;
    const page = event.page ? event.page + 1 : 1;
    this.loadBlockedCitizens(page);
  }
  onSecondPageChange(event: PaginatorState) {
    this.first = event.first || 0;
    this.rows = event.rows || 5;
    const page = event.page ? event.page + 1 : 1;
    this.loadCitizens(page);
  }
  loadBlockedCitizens(page: any): void {
    this.citizenService.getCitizens('blocked', page).subscribe(
      (data) => {
        console.log(data);
        this.blockedCitizens = data.paginationResults.results;
        this.totalRecord = data.paginationResults.total;
        console.log(data.paginationResults.total);
        // this.blockedCitizens = data.filter(
        //   (citizen) => citizen.status === 'blocked',
        // );
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
        (res) => {
          console.log(citizen)
          citizen.status = statusToUpdate;
          if (statusToUpdate === 'blocked') {
            this.blockedCitizens.push(citizen)
          }
          if (statusToUpdate === 'unblocked') {
            console.log(333333333333333, this.blockedCitizens);
            this.blockedCitizens=this.blockedCitizens.filter((mycitizen) => {
              mycitizen._id !== res._id;
            });
          }

          //   this.citizens = this.citizens.filter((c) => c._id !== citizen._id);
          //   this.filteredCitizens = this.filteredCitizens.filter(
          //     (c) => c._id !== citizen._id,
          //   );
          //   this.blockedCitizens.push(citizen);
          // } else if (statusToUpdate === 'unblocked') {
          //   this.blockedCitizens = this.blockedCitizens.filter(
          //     (c) => c._id !== citizen._id,
          //   );
          //   this.citizens.push(citizen);
          //   this.filteredCitizens.push(citizen);
          // }
        },
        (error) => {
          this.error = `Error ${action.toLowerCase()} citizen: ${error.message}`;
          console.error(`Error ${action.toLowerCase()} citizen:`, error);
        },
      );
  }

  searchBySSN(): void {
    console.log(this.citizens)
    if (this.searchTerm) {
      this.filteredCitizens = this.citizens.filter((citizen) =>
        citizen.ssn.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    } else {
      this.filteredCitizens = this.citizens; // Show all if search term is empty
    }
  }
}
