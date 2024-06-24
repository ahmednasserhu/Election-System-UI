import { Component ,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
   isClosed = false;

   menuItems = [
    { name: 'Home', icon: 'home', route: '/admin' },
    { name: 'Candidates', icon: 'tachometer', route: '/admin/candidate' },
    { name: 'Citizen', icon: 'users', route: '/admin/citizen' },
    { name: 'Election', icon: 'envelope', route: '/admin/election' },
    
  ];

toggleSidebar() {
  this.isClosed = !this.isClosed;
}
}
