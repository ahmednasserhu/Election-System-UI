import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import { Citizen } from '../../Interfaces/citizen';
import { Router } from '@angular/router';

interface TokenPayload {
  name: string;
  image: string;
  citizen: Citizen;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'], // Correct property name
})
export class SidebarComponent implements OnInit {
  isClosed = false;
  adminName: string | null = '';
  adminImage: string | null = '';

  constructor(private router: Router) {}
  menuItems = [
    { name: 'Home', icon: 'home', route: '/admin' },
    { name: 'Candidates', icon: 'tachometer', route: '/admin/candidate' },
    { name: 'Citizen', icon: 'users', route: '/admin/citizen' },
    { name: 'Election', icon: 'envelope', route: '/admin/election' },
    { name: 'Add Admin', icon: 'plus', route: '/admin/add-admin' },
  ];

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<TokenPayload>(token);
      console.log(decodedToken);
      
      this.adminName = decodedToken.citizen.firstName;
      this.adminImage = decodedToken.citizen.image;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  
  }

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }
}
