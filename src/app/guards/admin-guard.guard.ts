import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
    const _Router = inject(Router);
    const role = localStorage.getItem('role');

    if (role === 'admin') {
      return true; // Allow navigation if role is admin
    } else {

    _Router.navigate(["/login"]);
    return false;
};
}