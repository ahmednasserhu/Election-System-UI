import { Component } from '@angular/core';
import { CandidateNavBarComponent } from '../candidate-nav-bar/candidate-nav-bar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CandidateNavBarComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './candidate-dashboard.component.html',
  styleUrl: './candidate-dashboard.component.css',
})
export class CandidateDashboardComponent {
  
}
