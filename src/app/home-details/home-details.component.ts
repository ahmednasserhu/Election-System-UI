import { Component ,OnInit } from '@angular/core';
import { Election } from '../Admin/Interfaces/election';
import { ElectionService } from '../Admin/Services/election.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-details.component.html',
  styleUrl: './home-details.component.css'
})
export class HomeDetailsComponent implements OnInit {
  election?: Election;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const electionId = params['id'];
      this.electionService.getElectionById(electionId).subscribe(election => {
        this.election = election;
        console.log(this.election); 
      });
    });
  }
}
