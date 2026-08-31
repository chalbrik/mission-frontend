import {Component, inject, signal} from '@angular/core';
import {Buttons} from "../buttons/buttons";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {Block} from '../../services/block';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {form, FormField, required, submit} from '@angular/forms/signals';
import {firstValueFrom} from 'rxjs';
import {BlockFormInterface, BlockInterface} from '../../interfaces/block.interface';
import {LucideCheck, LucideX} from '@lucide/angular';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatTimepicker, MatTimepickerInput, MatTimepickerToggle } from '@angular/material/timepicker';

@Component({
  selector: 'app-add-block-modal',
  imports: [
    Buttons,
    CdkTextareaAutosize,
    MatFormField,
    MatInput,
    MatLabel,
    FormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatTimepickerToggle,
    MatTimepicker,
    MatDatepickerInput,
    MatTimepickerInput
  ],
  templateUrl: './add-block-modal.html',
  styleUrl: './add-block-modal.scss',
})
export class AddBlockModal {
  private readonly blockService = inject(Block);
  private readonly data = inject<{ goalId?: number; block?: BlockInterface }>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<AddBlockModal>);

  protected readonly LucideX = LucideX;
  protected readonly LucideCheck = LucideCheck;

  protected readonly error = signal<string | null>(null);
  protected readonly isEdit = !!this.data.block;

  blockModel = signal({
    goal: this.data.block?.goal ?? this.data.goalId!,
    name: this.data.block?.name ?? '',
    start_date: this.parseDate(this.data.block?.start_date ?? null),
    start_time: this.parseTime(this.data.block?.start_time ?? null),
    end_date: this.parseDate(this.data.block?.end_date ?? null),
    end_time: this.parseTime(this.data.block?.end_time ?? null),
  });

  addBlockForm = form(this.blockModel, (path) => {
    required(path.name, { message: 'Nazwa zadania jest wymagana' });
  });

  saveBlock(event: Event) {
    event.preventDefault();
    submit(this.addBlockForm, {
      action: async () => {
        const payload = this.toPayload();

        if (payload.end_date && !payload.start_date) {
          this.error.set('Data zakończenia wymaga daty rozpoczęcia.');
          return;
        }
        if (payload.end_date && payload.start_date && payload.end_date < payload.start_date) {
          this.error.set('Data zakończenia nie może być wcześniejsza niż rozpoczęcia.');
          return;
        }

        try {
          const block = this.data.block;
          if (block) {
            await firstValueFrom(this.blockService.editBlock(block.id, payload));
          } else {
            await firstValueFrom(this.blockService.createBlock(payload));
          }
          this.dialogRef.close(true);
        } catch {
          this.error.set('Nie udało się zapisać bloku');
        }
      }
    });
  }

  private toPayload(): BlockFormInterface {
    const m = this.blockModel();
    return {
      goal: m.goal,
      name: m.name,
      start_date: this.formatDate(m.start_date),
      start_time: this.formatTime(m.start_time),
      end_date: this.formatDate(m.end_date),
      end_time: this.formatTime(m.end_time),
    };
  }

  parseDate(date: string | null): Date | null {
    return date ? new Date(date + 'T00:00:00') : null;
  }

  parseTime(time: string | null): Date | null {
    return time ? new Date(`1970-01-01T${time}`) : null;
  }

  formatDate(date: Date | null): string | null {
    if (!date) return null;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  formatTime(date: Date | null): string | null {
    if (!date) return null;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
