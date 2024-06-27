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
import { ElectionService } from '../../services/election.service';

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
  elections!:Array<any>;
  constructor(private electionservice:ElectionService,private route: ActivatedRoute,){}

  ngOnInit() {
    this.electionservice.getElections().subscribe((e)=>{
      this.elections = e;
      console.log(this.elections)
    })
  }
}
