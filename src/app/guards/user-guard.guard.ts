import { CanActivateFn } from '@angular/router';

export const userGuardGuard: CanActivateFn = (route, state) => {
  // localStorage.getItem()
  return true
};
