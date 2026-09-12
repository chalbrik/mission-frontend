import {Component, inject, signal} from '@angular/core';
import {Buttons} from "../buttons/buttons";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {form, FormField, required, submit} from '@angular/forms/signals';
import {firstValueFrom} from 'rxjs';
import {CounterCardService} from '../../services/counter-card';
import {CounterCardFormInterface, CounterCardInterface} from '../../interfaces/counter-card.interface';
import {LucideCheck, LucideX} from '@lucide/angular';

@Component({
  selector: 'app-add-counter-card-modal',
  imports: [
    Buttons,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    FormField
  ],
  templateUrl: './add-counter-card-modal.html',
  styleUrl: './add-counter-card-modal.scss',
})
export class AddCounterCardModal {
  private readonly counterCardService = inject(CounterCardService);
  protected readonly dialogRef = inject(MatDialogRef<AddCounterCardModal>);
  protected readonly data = inject<{ counterCard?: CounterCardInterface }>(MAT_DIALOG_DATA, { optional: true });

  protected readonly error = signal<string | null>(null);

  counterCardModel = signal<CounterCardFormInterface>(
    {
      title: this.data?.counterCard?.title ?? '',
    }
  );

  counterCardForm = form(this.counterCardModel, (path) => {
    required(path.title, { message: 'Nazwa serii jest wymagana' });
  });

  createCounterCard(event: Event) {
    event.preventDefault();
    submit(this.counterCardForm, {
      action: async () => {
        try {
          const counterCard = this.data?.counterCard;
          if (counterCard) {
            await firstValueFrom(this.counterCardService.editCounterCard(counterCard.id, this.counterCardModel()));
          } else {
            await firstValueFrom(this.counterCardService.createCounterCard(this.counterCardModel()));
          }
          this.dialogRef.close();
        } catch {
          this.error.set('Nie udało się zapisać karty serii');
        }
      }
    });
  }


  protected readonly LucideX = LucideX;
  protected readonly LucideCheck = LucideCheck;

}
