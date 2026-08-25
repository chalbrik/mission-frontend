import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {RoleCreatePayload, RoleFormInterface, RoleInterface} from '../interfaces/role.interface';
import {getIdentityColorPool, pickIdentityColor} from '../utils/role-colors';

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
    const used = this._roles().map((r) => r.color).filter(Boolean);
    const payload: RoleCreatePayload = { ...role, color: pickIdentityColor(getIdentityColorPool(), used) };

    return this.http.post<RoleInterface>(`${this.apiUrl}roles/`, payload).pipe(
      tap((created) => {
          this._roles.update((list) => [...list, created]);
        }
      )
    );
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}roles/${id}/`).pipe(
      tap(() => this._roles.update((list) => list.filter((r) => r.id !== id))),
    );
  }

  editRole(id: number, editForm: RoleFormInterface): Observable<RoleInterface> {
    return this.http.patch<RoleInterface>(`${this.apiUrl}roles/${id}/`, editForm).pipe(
      tap((updated) => this._roles.update((list) =>
        list.map((r) => (r.id === updated.id ? updated : r)),
      )),
    );
  }

  setPoints(roleId: number, points: number): void {
    this._roles.update((list) => list.map((r) => (r.id === roleId ? { ...r, points } : r)));
  }
}
