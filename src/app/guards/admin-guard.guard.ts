import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const role = decodedToken.citizen.role;
      if (role === 'admin') {
        return true;
      } else {
        toastr.error('Not Authorized To Access Admin Pages');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.navigate(['/login']);
        return false;
      }
    } catch (e) {
      console.error('Invalid token:', e);
    }
  }
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  toastr.error('Not Authorized To Access Admin Pages');
  router.navigate(['/login']);
  return false;
};
