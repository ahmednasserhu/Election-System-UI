import { Component, OnInit } from '@angular/core';
import { Citizen } from '../../Interfaces/citizen';
import { CitizenService } from '../../Services/citizen.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citizen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citizen.component.html',
  styleUrls: ['./citizen.component.css']
})
export class CitizenComponent implements OnInit {
  citizens: Citizen[] = [];
  blockedCitizens: Citizen[] = [];
  error: string = '';  // Add an error message property

  constructor(private citizenService: CitizenService) { }

  ngOnInit(): void {
    this.loadCitizens();
    this.loadBlockedCitizens();
  }

  loadCitizens(): void {
    this.citizenService.getCitizens().subscribe(
      data => {
        if (Array.isArray(data)) {
          this.citizens = data.filter(citizen => citizen.status !== 'Blocked');
        } else {
          this.error = 'Expected array but got: ' + JSON.stringify(data);
          console.error('Expected array but got:', data);
        }
      },
      error => {
        this.error = 'Error loading citizens: ' + error.message;
        console.error('Error loading citizens:', error);
      }
    );
  }

  loadBlockedCitizens(): void {
    this.citizenService.getCitizens().subscribe(
      data => {
        if (Array.isArray(data)) {
          this.blockedCitizens = data.filter(citizen => citizen.status === 'Blocked');
        } else {
          this.error = 'Expected array but got: ' + JSON.stringify(data);
          console.error('Expected array but got:', data);
        }
      },
      error => {
        this.error = 'Error loading blocked citizens: ' + error.message;
        console.error('Error loading blocked citizens:', error);
      }
    );
  }

  blockCitizen(citizen: Citizen): void {
    this.citizenService.blockCitizen(citizen._id).subscribe(
      () => {
        citizen.status = 'Blocked';
        this.citizens = this.citizens.filter(c => c._id !== citizen._id);
        this.blockedCitizens.push(citizen);
      },
      error => {
        this.error = 'Error blocking citizen: ' + error.message;
        console.error('Error blocking citizen:', error);
      }
    );
  }
}
