import {Component, inject, input, signal} from '@angular/core';
import {Buttons} from "../buttons/buttons";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {form, FormField, required, submit} from '@angular/forms/signals';
import {firstValueFrom} from 'rxjs';
import {Goal} from '../../services/goal';
import {GoalFormInterface} from '../../interfaces/goal.interface';
import {LucideCheck, LucideX} from '@lucide/angular';
import {RoleInterface} from '../../interfaces/role.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-goal-modal',
  imports: [
    Buttons,
    MatFormField,
    MatInput,
    MatLabel,
    FormField,
    CdkTextareaAutosize
  ],
  templateUrl: './add-goal-modal.html',
  styleUrl: './add-goal-modal.scss',
})
export class AddGoalModal {
  private readonly goalService = inject(Goal);
  private readonly data = inject<{ roleId: number }>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<AddGoalModal>);

  protected readonly LucideX = LucideX;
  protected readonly LucideCheck = LucideCheck;

  protected readonly error = signal<string | null>(null);

  role = input<RoleInterface>()

  goalModel = signal<GoalFormInterface>(
    {
      role: this.data.roleId,
      target_outcome: '',
    }
  );

  addGoalForm = form(this.goalModel, (path) => {
    required(path.target_outcome, { message: 'Nazwa celu jest wymagana' });
  });

  createGoal(event: Event) {
    event.preventDefault();
    submit(this.addGoalForm, {
      action: async () => {
        try {
          await firstValueFrom(this.goalService.createGoal(this.goalModel()));
          this.dialogRef.close(true);
        } catch {
          this.error.set('Nie udało się zapisać roli');
        }
      }
    });
  }

}
