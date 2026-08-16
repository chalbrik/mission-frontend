import {Component, effect, inject, input, output, signal} from '@angular/core';
import {AddTab} from '../add-tab/add-tab';
import {MatDialog} from '@angular/material/dialog';
import {AddGoalModal} from '../add-goal-modal/add-goal-modal';
import {Goal} from '../../services/goal';
import {GoalCard} from '../goal-card/goal-card';

@Component({
  selector: 'app-goal-table',
  imports: [
    AddTab,
    GoalCard
  ],
  templateUrl: './goal-table.html',
  styleUrl: './goal-table.scss',
  standalone: true,
})
export class GoalTable {
  private readonly dialog = inject(MatDialog);
  private readonly goalService = inject(Goal);

  roleId = input.required<number>();

  readonly goals = this.goalService.goals;
  readonly error = this.goalService.error;

  readonly goalSelected = output<number>();
  readonly selectedGoalId = signal<number>(0);

  constructor() {
    effect(() => {
      this.selectedGoalId.set(0);
      this.goalService.loadGoals(this.roleId());
    });
  }

  openAddGoal() {
    this.dialog.open(AddGoalModal, { data: { roleId: this.roleId() } });
  }

  onGoalSelected(id: number) {
    this.selectedGoalId.set(id);
    this.goalSelected.emit(id);
  }

}
