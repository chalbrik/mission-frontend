import { HttpClient, HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

let isRefreshing = false;
const newAccess$ = new BehaviorSubject<string | null>(null);

const withToken = (req: HttpRequest<unknown>, token: string) =>
  req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  const isApi = req.url.startsWith(environment.apiUrl);
  const isTokenEndpoint = req.url.startsWith(`${environment.apiUrl}token`);

  if (!isApi || isTokenEndpoint) {
    return next(req);
  }

  const access = localStorage.getItem('access');
  const authReq = access ? withToken(req, access) : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) {
        return throwError(() => err);
      }

      if (isRefreshing) {
        return newAccess$.pipe(
          filter((token): token is string => token !== null),
          take(1),
          switchMap((token) => next(withToken(req, token))),
        );
      }

      const refresh = localStorage.getItem('refresh');
      if (!refresh) {
        router.navigateByUrl('/');
        return throwError(() => err);
      }

      isRefreshing = true;
      newAccess$.next(null);

      return http.post<{ access: string }>(`${environment.apiUrl}token/refresh/`, { refresh }).pipe(
        switchMap(({ access }) => {
          localStorage.setItem('access', access);
          isRefreshing = false;
          newAccess$.next(access);
          return next(withToken(req, access));
        }),
        catchError((refreshErr) => {
          isRefreshing = false;
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          router.navigateByUrl('/');
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
