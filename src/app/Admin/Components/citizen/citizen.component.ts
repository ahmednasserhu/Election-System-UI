import { Component, OnInit } from '@angular/core';
import { Citizen } from '../../Interfaces/citizen';
import { CitizenService } from '../../Services/citizen.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citizen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citizen.component.html',
  styleUrl: './citizen.component.css'
})
export class CitizenComponent implements OnInit {
  citizens: Citizen[] = [];
  blockedCitizens: Citizen[] = [];

  constructor(private citizenService: CitizenService) { }

  ngOnInit(): void {
    this.loadCitizens();
    this.loadBlockedCitizens();
  }

  loadCitizens(): void {
    this.citizenService.getCitizens().subscribe(data => {
      this.citizens = data.filter(citizen => citizen.status !== 'Blocked');
    }, error => {
      console.error('Error loading citizens:', error);
    });
  }

  loadBlockedCitizens(): void {
    this.citizenService.getCitizens().subscribe(data => {
      this.blockedCitizens = data.filter(citizen => citizen.status === 'Blocked');
    }, error => {
      console.error('Error loading blocked citizens:', error);
    });
  }

  blockCitizen(citizen: Citizen): void {
    this.citizenService.blockCitizen(citizen.id).subscribe(() => {
      citizen.status = 'Blocked';
      this.citizens = this.citizens.filter(c => c.id !== citizen.id);
      this.blockedCitizens.push(citizen);
    }, error => {
      console.error('Error blocking citizen:', error);
    });
  }
}
