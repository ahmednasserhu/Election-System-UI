import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

  navigateBasedOnRole(token: string): void {
    const decodedToken = this.decodeToken(token);

    if (decodedToken && decodedToken.role) {
      switch (decodedToken.role) {
        case 'admin':
          this.router.navigate(['/admin']);
          break;
        case 'candidate':
          this.router.navigate(['/candidate']);
          break;
        case 'citizen':
          this.router.navigate(['/citizen']);
          break;
        default:
          console.error("Unknown role:", decodedToken.role);
      }
    } else {
      console.error("Role not found in token");
    }
  }
}
