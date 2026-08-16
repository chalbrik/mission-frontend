import {Component, inject, input, output, signal} from '@angular/core';
import {GoalInterface} from '../../interfaces/goal.interface';
import {Buttons} from '../buttons/buttons';
import {LucideTrash2, LucideX} from '@lucide/angular';
import {Goal} from '../../services/goal';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-goal-card',
  imports: [
    Buttons,
    MatCheckbox
  ],
  templateUrl: './goal-card.html',
  styleUrl: './goal-card.scss',
  standalone: true,
})
export class GoalCard {
  protected readonly LucideTrash2 = LucideTrash2;
  private readonly goalService = inject(Goal);

  goal = input.required<GoalInterface>();
  isSelected = input<boolean>(false);

  readonly selected = output<number>();

  protected readonly completed = signal(false);

  complete() {
    if (this.completed()) return;
    this.completed.set(true);

    this.goalService.completeGoal(this.goal().id, this.goal().role).subscribe({
      error: () => this.completed.set(false),
    });
  }

  deleteGoal(goal: GoalInterface) {
    this.goalService.deleteGoal(this.goal().id).subscribe({
      error: () => console.error('Nie udało się usunąć celu'),
    });
  }

}
