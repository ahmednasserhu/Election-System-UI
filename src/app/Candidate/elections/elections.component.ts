import { Component } from '@angular/core';
import { CandidateNavBarComponent } from '../candidate-nav-bar/candidate-nav-bar.component';
import { CommonModule } from '@angular/common';
import { ElectionService } from '../../services/election.service';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CandidateNavBarComponent, CommonModule],
  templateUrl: './elections.component.html',
  styleUrl: './elections.component.css',
})
export class ElectionsComponent {
  elections!: Array<any>;
  constructor(private electionservice: ElectionService) {}

  ngOnInit() {
    this.electionservice.getElections().subscribe((e) => {
      this.elections = e;
      console.log(this.elections);
    });
  }
}
