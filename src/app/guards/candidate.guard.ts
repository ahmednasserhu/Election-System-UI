import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

export const candidateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const role = decodedToken.citizen.role;
      console.log(role);
      
      if (role === 'candidate') {
        return true; 
      } else {
        toastr.error('Not Authorized To Access Candidate Pages');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.navigate(['/login']);
        return false;
      }
    } catch (e) {
      console.error('Invalid token:', e);
    }
  }

  toastr.error('Not Authorized To Access Candidate Pages');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  router.navigate(['/login']); 
  return false;
};
