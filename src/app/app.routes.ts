import { Routes } from '@angular/router';
import { AdminComponent } from './Admin/admin/admin.component';
import { HomeComponent } from './Admin/Components/home/home.component';
import { CandidateComponent } from './Admin/Components/candidate/candidate.component';
import { ElectionComponent } from './Admin/Components/election/election.component';
import { CitizenComponent } from './Admin/Components/citizen/citizen.component';
import { PageNotFoundComponent } from './Admin/Components/page-not-found/page-not-found.component';

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
       
        { path: "**", component: PageNotFoundComponent },
    
    ],
}
];
