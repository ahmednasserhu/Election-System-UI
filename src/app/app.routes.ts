import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CandidateDashboardComponent } from './Candidate/candidate-dashboard/candidate-dashboard.component';
import { CandidateProfileComponent } from './Candidate/candidate-profile/candidate-profile.component';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    title: 'register'
  },
  {
    path: 'candidate',
    component: CandidateDashboardComponent,
    title: 'Candidate Dashboard',
  },
  {
    path: 'candidate/profile/:id',
    component: CandidateProfileComponent,
    title: 'Candidate Profile',
  },

];
