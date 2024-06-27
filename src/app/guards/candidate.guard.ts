import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const candidateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const role = decodedToken.role;
      // console.log(role);

      if (role === 'candidate') {
        return true; // Allow navigation if role is 'admin'
      } else {
        // Navigate to unauthorized page or candidate page
        router.navigate(['/login']);
        return false;
      }
    } catch (e) {
      console.error('Invalid token:', e);
    }
  }

  router.navigate(['/login']); // Navigate to login page if not authorized
  return false;
};
