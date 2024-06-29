import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtPayload, jwtDecode } from 'jwt-decode';


interface CandidateJwtPayload extends JwtPayload {
  citizen: {
    role: string;
    image: string
  };
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgbCollapseModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isMenuCollapsed = true;
  isLogged = false;
  image!: any;
  role !:any
  decodedToken;

  constructor() {
    this.isLogged = localStorage.getItem('token') ? true : false;
    console.log(this.isLogged);
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    console.log(token);
    if (token) this.decodedToken = jwtDecode<CandidateJwtPayload>(token);
    this.image = this.decodedToken?.citizen.image;
    this.role = this.decodedToken?.citizen.role;
  }
  ngOnInit(): void {
    if (this.isLogged) {
      localStorage.getItem('token');
    }
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLogged=false
  }
}
