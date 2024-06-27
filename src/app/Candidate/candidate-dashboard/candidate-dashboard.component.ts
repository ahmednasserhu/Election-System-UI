import { Component } from '@angular/core';
import { CandidateNavBarComponent } from '../candidate-nav-bar/candidate-nav-bar.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CandidateProfileService } from '../../services/candidate-profile.service';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CandidateNavBarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './candidate-dashboard.component.html',
  styleUrl: './candidate-dashboard.component.css',
})
export class CandidateDashboardComponent {
  candidateId!: string;
  candidateData!:any;
  constructor(private dashboardservice:CandidateProfileService,private route: ActivatedRoute,){}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.candidateId = params['id'];
    });
    this.dashboardservice.getProfile(this.candidateId).subscribe((e) => {
      this.candidateData = e;
      console.log(this.candidateData);
    })
  }
}
