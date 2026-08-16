import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {RoleFormInterface, RoleInterface} from '../interfaces/role.interface';

@Service()
export class Role {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private readonly _roles = signal<RoleInterface[]>([]);
  private readonly _error = signal<string | null>(null);

  readonly roles = this._roles.asReadonly();
  readonly error = this._error.asReadonly();

  loadRoles(): void {
    this.http.get<RoleInterface[]>(`${this.apiUrl}roles/`).subscribe({
      next: (list) => {
        this._roles.set(list);
        this._error.set(null);
      },
      error: () => this._error.set('Błąd wczytywania listy ról.'),
    });
  }

  createRole(role: RoleFormInterface): Observable<RoleInterface> {
    return this.http.post<RoleInterface>(`${this.apiUrl}roles/`, role).pipe(
      tap((created) => this._roles.update((list) => [...list, created])),
    );
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}roles/${id}/`).pipe(
      tap(() => this._roles.update((list) => list.filter((r) => r.id !== id))),
    );
  }

  setPoints(roleId: number, points: number): void {
    this._roles.update((list) => list.map((r) => (r.id === roleId ? { ...r, points } : r)));
  }
}
