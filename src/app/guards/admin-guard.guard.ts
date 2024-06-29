import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {jwtDecode} from 'jwt-decode';

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
        toastr.error('please to access these pages lOGIN AS ADMIN PLEASE');
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
  toastr.error('please to access these pages lOGIN AS ADMIN PLEASE');
  router.navigate(['/login']); 
  return false;
};
