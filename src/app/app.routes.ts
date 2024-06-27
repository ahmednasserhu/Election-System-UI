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
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeDetailsComponent } from './home-details/home-details.component';
import { PageNotFoundComponent } from './Admin/Components/page-not-found/page-not-found.component';
import { AddAdminComponent } from './Admin/Components/add-admin/add-admin.component';
import { AdminProfileComponent } from './Admin/Components/admin-profile/admin-profile.component';
import { CitizenComponent } from './Admin/Components/citizen/citizen.component';
import { ElectionComponent } from './Admin/Components/election/election.component';
import { CandidateComponent } from './Admin/Components/candidate/candidate.component';
import { AdminComponent } from './Admin/admin/admin.component';
import { HomeComponentAdmin } from './Admin/Components/home/home.component';
// import { authGuard } from './guards/admin-guard.guard';

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
    path: "admin",
    component: AdminComponent,
    // canActivate: [authGuard],

    children: [
        { path: "", component: HomeComponentAdmin },
        { path: "candidate", component: CandidateComponent },
        { path: "election", component: ElectionComponent },
        { path: "citizen", component: CitizenComponent },
        { path: "profile", component: AdminProfileComponent },
        { path: "add-admin", component: AddAdminComponent },
       
        { path: "**", component: PageNotFoundComponent },
    
    ],
},
{
    path: "login",
    component: LoginComponent
},
{
    path: "reset-password",
    component: ResetPasswordComponent
},
{
    path: "homeDetails/:id",
    component: HomeDetailsComponent
},
];
