import {Component, inject, input, signal} from '@angular/core';
import {Buttons} from "../buttons/buttons";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {Block} from '../../services/block';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {form, FormField, required, submit} from '@angular/forms/signals';
import {firstValueFrom} from 'rxjs';
import {BlockFormInterface, BlockInterface} from '../../interfaces/block.interface';
import {LucideCheck, LucideX} from '@lucide/angular';

@Component({
  selector: 'app-add-block-modal',
  imports: [
    Buttons,
    CdkTextareaAutosize,
    MatFormField,
    MatInput,
    MatLabel,
    FormField
  ],
  templateUrl: './add-block-modal.html',
  styleUrl: './add-block-modal.scss',
})
export class AddBlockModal {
  private readonly blockService = inject(Block);
  private readonly data = inject<{ goalId: number }>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<AddBlockModal>);

  protected readonly LucideX = LucideX;
  protected readonly LucideCheck = LucideCheck;

  protected readonly error = signal<string | null>(null);

  block = input<BlockInterface>()

  blockModel = signal<BlockFormInterface>(
    {
      goal: this.data.goalId,
      name: '',
    }
  );

  addBlockForm = form(this.blockModel, (path) => {
    required(path.name, { message: 'Nazwa zadania jest wymagana' });
  });

  createBlock(event: Event) {
    event.preventDefault();
    submit(this.addBlockForm, {
      action: async () => {
        try {
          await firstValueFrom(this.blockService.createBlock(this.blockModel()));
          this.dialogRef.close(true);
        } catch {
          this.error.set('Nie udało się zapisać roli');
        }
      }
    });
  }
}
