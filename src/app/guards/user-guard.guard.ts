import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const userGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const undecodeToken = localStorage.getItem('token');
  if (!undecodeToken) {
    router.navigate(['/login']);
    return false;
  } else {
    try {
      const codedToken = jwtDecode(undecodeToken);
      console.log(codedToken);
    } catch (error) {
      router.navigate(['/login']);
      return false;
    }
  }
  return true;
};
