import { Routes } from '@angular/router';
import { AdminComponent } from './Admin/admin/admin.component';
import { HomeComponent } from './Admin/Components/home/home.component';
import { CandidateComponent } from './Admin/Components/candidate/candidate.component'
import { ElectionComponent } from './Admin/Components/election/election.component';
import { CitizenComponent } from './Admin/Components/citizen/citizen.component';
import { PageNotFoundComponent } from './Admin/Components/page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { HomeDetailsComponent } from './home-details/home-details.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminProfileComponent } from './Admin/Components/admin-profile/admin-profile.component';
import { AddAdminComponent } from './Admin/Components/add-admin/add-admin.component';

export const routes: Routes = [
    {
    path: "admin",
    component: AdminComponent,
    // canActivate: [AuthGuard],

    children: [
        { path: "", component: HomeComponent },
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
