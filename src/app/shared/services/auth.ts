import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);

  login(username: string, password: string) {
    return this.http.post<TokenResponse>(`${environment.apiUrl}token/`, { username, password }).pipe(
      tap(({ access, refresh }) => {
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
      }),
    );
  }

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access');
  }
}
