import { Component } from '@angular/core';
import { CandidateNavBarComponent } from '../candidate-nav-bar/candidate-nav-bar.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { ElectionService } from '../../services/election.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CandidateNavBarComponent, CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './candidate-dashboard.component.html',
  styleUrl: './candidate-dashboard.component.css',
})
export class CandidateDashboardComponent {
  candidateId!: string;
  candidateData!: any;
  decodedToken: any;
  userId!: string;
  token!: any;
  loading: boolean = false;
  elections!: Array<any>;
  constructor(private electionservice: ElectionService, private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = localStorage.getItem("token");
    this.decodedToken = jwtDecode(this.token);
    this.userId = this.decodedToken.citizen._id;
    this.fetchElections(this.userId);
  }

  fetchElections(id: any): void {
    this.loading = true;
    this.electionservice.getMyElections(id).subscribe(
      (res) => {
        console.log(res);
        this.elections = res;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching elections:', error);
        this.loading = false;
      }
    );
  }

  vote(id:any) {
    this.router.navigate(['/user/election-details', id]);
  }
}
