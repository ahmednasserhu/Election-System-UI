import { jwtDecode } from 'jwt-decode';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const role = decodedToken.role;

      if (role === 'admin') {
        return true; // Allow navigation if role is 'admin'
      } else {
        // Navigate to unauthorized page or candidate page
        router.navigate(['/unauthorized']);
        return false;
      }
    } catch (e) {
      console.error('Invalid token:', e);
    }
  }

  router.navigate(['/login']); // Navigate to login page if not authorized
  return false;
};
