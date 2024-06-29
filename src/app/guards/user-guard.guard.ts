import { ToastrService } from 'ngx-toastr';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
interface CandidateJwtPayload extends JwtPayload {
  citizen: {
    role: string;
  };
}

export const userGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const undecodeToken = localStorage.getItem('token');
  if (!undecodeToken) {
    router.navigate(['/login']);
    return false;
  } else {
    try {
      const codedToken = jwtDecode<CandidateJwtPayload>(undecodeToken);
      console.log('me', codedToken.citizen.role);
      if (codedToken.citizen.role !== 'admin') return true;
      else {
        toastr.error(
          'You are admin and can not be treated as user instead you can easily register as user',
        );
        router.navigate(['/register']);
        return false;
      }
    } catch (error) {
      router.navigate(['/login']);
      return false;
    }
  }
  return true;
};
