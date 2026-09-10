import {inject, Service, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CounterCardInterface, CounterCardFormInterface} from '../interfaces/counter-card.interface';
import {RoleCreatePayload, RoleFormInterface, RoleInterface} from '../interfaces/role.interface';
import {Observable, tap} from 'rxjs';
import {getIdentityColorPool, pickIdentityColor} from '../utils/role-colors';



@Service()
export class CounterCard {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private readonly _counterCards = signal<CounterCardInterface[]>([]);
  private readonly _error = signal<string | null>(null);

  readonly counterCards = this._counterCards.asReadonly();
  readonly error = this._error.asReadonly();

  loadCounterCards(): void {
    this.http.get<CounterCardInterface[]>(`${this.apiUrl}counter-cards/`).subscribe({
      next: (list) => {
        this._counterCards.set(list);
        this._error.set(null);
      },
      error: () => this._error.set('Błąd wczytywania listy liczników.'),
    });
  }

  createCounterCard(counterCard: CounterCardFormInterface): Observable<CounterCardInterface> {
    return this.http.post<GoalInterface>(`${this.apiUrl}counter-cards/`, counterCard).pipe(
      tap((created) => this._counterCards.update((list) => [...list, created])),
    );
  }

  updateCounterCard(id: number, counterCard: CounterCardFormInterface): Observable<CounterCardInterface> {
    return this.http.patch<CounterCardInterface>(`${this.apiUrl}counter-cards/${id}/`, counterCard).pipe(
      tap((updated) => this._counterCards.update((list) => [...list, updated])),
    );
  }

  deleteCounterCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}counter-cards/${id}/`).pipe(
      tap(() => this._counterCards.update((list) => list.filter((g) => g.id !== id))),
    );
  }

  markSuccess(id: number): Observable<CounterCardInterface> {
    return this.http.patch<CounterCardInterface>(`${this.apiUrl}counter-cards/${id}/success`, counterCard).pipe(
      tap((created) => this._counterCards.update((list) => [...list, created])),
    );
  }

  reset(id: number): Observable<CounterCardInterface> {
    return this.http.patchC<CounterCardInterface>(`${this.apiUrl}counter-cards/${id}/reset`, counterCard).pipe(
      tap((created) => this._counterCards.update((list) => [...list, created])),
    );
  }

}
