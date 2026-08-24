import {inject, Service, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BlockFormInterface, BlockInterface} from '../interfaces/block.interface';
import {Observable, tap} from 'rxjs';

@Service()
export class Block {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private readonly _blocks = signal<BlockInterface[]>([]);
  private readonly _error = signal<string | null>(null);
  private readonly _calendarBlocks = signal<BlockInterface[]>([]);

  readonly blocks = this._blocks.asReadonly();
  readonly error = this._error.asReadonly();
  readonly calendarBlocks = this._calendarBlocks.asReadonly();

  loadBlocks(roleId: number): void {
    this.http.get<BlockInterface[]>(`${this.apiUrl}blocks/?goal=${roleId}`).subscribe({
      next: (list) => {
        this._blocks.set(list);
        this._error.set(null);
      },
      error: () => this._error.set('Błąd wczytywania listy ról.'),
    });
  }

  loadCalendarBlocks(): void {
    this.http.get<BlockInterface[]>(`${this.apiUrl}blocks/`).subscribe({
      next: (list) => {
        this._calendarBlocks.set(list);
        this._error.set(null);
      },
      error: () => this._error.set('Błąd wczytywania kalendarza.'),
    });
  }

  createBlock(block: BlockFormInterface): Observable<BlockInterface> {
    return this.http.post<BlockInterface>(`${this.apiUrl}blocks/`, block).pipe(
      tap((created) => {
        this._blocks.update((list) => [...list, created]);
        if (created.scheduled_date) {
          this._calendarBlocks.update((list) => [...list, created]);
        }
      }),
    );
  }

  deleteBlock(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}blocks/${id}/`).pipe(
      tap(() => this._blocks.update((list) => list.filter((b) => b.id !== id))),
    );
  }

  scheduleBlock(id: number, scheduled_date: string): Observable<BlockInterface> {
    return this.http.patch<BlockInterface>(`${this.apiUrl}blocks/${id}/`, { scheduled_date }).pipe(
      tap((updated) => this._calendarBlocks.update((list) =>
        list.map((b) => (b.id === updated.id ? updated : b)),
      )),
    );
  }

}
