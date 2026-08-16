import {inject, Service, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

import {Observable, tap} from 'rxjs';
import {GoalFormInterface, GoalInterface} from '../interfaces/goal.interface';
import {Role} from './role';

@Service()
export class Goal {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly roleService = inject(Role);

  private readonly _goals = signal<GoalInterface[]>([]);
  private readonly _error = signal<string | null>(null);

  readonly goals = this._goals.asReadonly();
  readonly error = this._error.asReadonly();

  loadGoals(roleId: number): void {
    this.http.get<GoalInterface[]>(`${this.apiUrl}goals/?role=${roleId}`).subscribe({
      next: (list) => {
        this._goals.set(list);
        this._error.set(null);
      },
      error: () => this._error.set('Błąd wczytywania listy ról.'),
    });
  }

  createGoal(goal: GoalFormInterface): Observable<GoalInterface> {
    return this.http.post<GoalInterface>(`${this.apiUrl}goals/`, goal).pipe(
      tap((created) => this._goals.update((list) => [...list, created])),
    );
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}goals/${id}/`).pipe(
      tap(() => this._goals.update((list) => list.filter((g) => g.id !== id))),
    );
  }

  completeGoal(id: number, roleId: number): Observable<{ role: number; points: number }> {
    return this.http.post<{ role: number; points: number }>(`${this.apiUrl}goals/${id}/complete/`, {})
      .pipe(
      tap((res) => {
        this.roleService.setPoints(res.role, res.points);
        setTimeout(() => this._goals.update((list) => list.filter((g) => g.id !== id)), 5000);
      }),
    );
  }
}
