import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CandidateDashboardComponent } from './Candidate/candidate-dashboard/candidate-dashboard.component';
import { CandidateProfileComponent } from './Candidate/candidate-profile/candidate-profile.component';

import { HomeComponent } from './general/home/home.component';
import { AboutUsComponent } from './general/about-us/about-us.component';
import { ElectionsComponent } from './user/elections/elections.component';
import { ParentComponent } from './general/parent/parent.component';
import { UserParentComponent } from './user/user-parent/user-parent.component';
import { ElectionDetailsComponent } from './user/election-details/election-details.component';
import { UserprofileComponent } from './user/userprofile/userprofile.component';
import { ApplyComponent } from './user/apply/apply.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'about',
        component: AboutUsComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
    component: ParentComponent,
  },
  {
    path: 'user',
    children: [
      {
        path: '',
        component: ElectionsComponent,
      },
      {
        path: 'elections',
        component: ElectionsComponent,
      },
      {
        path: 'profile/:id',
        component: UserprofileComponent,
      },
      {
        path: 'election-details/:id',
        component: ElectionDetailsComponent,
      },
      {
        path: 'apply/:id',
        component: ApplyComponent,
      },
    ],
    component: UserParentComponent,
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
  {
    path: 'candidate/elections',
    component: ElectionsComponent,
    title: 'Elections',
  },
];
