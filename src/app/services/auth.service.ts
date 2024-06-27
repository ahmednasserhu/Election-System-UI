import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  navigateBasedOnRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'candidate':
        this.router.navigate(['/candidate']);
        break;
      case 'citizen':
        this.router.navigate(['/user']);
        break;
      default:
        console.error('Unknown role:', role);
    }
  }
}
