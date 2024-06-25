import { HttpInterceptorFn } from '@angular/common/http';

export const candidateInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if(token) {
    const cloned = req.clone({
      setHeaders: {
        token: `${token}`,
      }
    })
    return next(cloned);
  }
  return next(req)
};
