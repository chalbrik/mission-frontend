import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access');
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isTokenEndpoint = req.url.startsWith(`${environment.apiUrl}token`);

  if (token && isApiRequest && !isTokenEndpoint) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
