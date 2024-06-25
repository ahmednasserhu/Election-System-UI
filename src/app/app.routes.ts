import { Routes } from '@angular/router';

import { HomeComponent } from './general/home/home.component';
import { AboutUsComponent } from './general/about-us/about-us.component';
import { ElectionsComponent } from './user/elections/elections.component';
import { ParentComponent } from './general/parent/parent.component';
import { UserParentComponent } from './user/user-parent/user-parent.component';
import { ElectionDetailsComponent } from './user/election-details/election-details.component';

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
        path: 'election-details/:id',
        component: ElectionDetailsComponent,
      },
    ],
    component: UserParentComponent,
  },

];
