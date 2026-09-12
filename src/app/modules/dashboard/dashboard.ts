import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {Navigation} from '../navigation/navigation';
import {RoleCard} from '../../shared/components/role-card/role-card';
import {AddTab} from '../../shared/components/add-tab/add-tab';
import {Role} from '../../shared/services/role';
import {GoalTable} from '../../shared/components/goal-table/goal-table';
import {AddRoleModal} from '../../shared/components/add-role-modal/add-role-modal';
import {MatDialog} from '@angular/material/dialog';
import {BlockTable} from '../../shared/components/block-table/block-table';
import {CounterCard} from '../../shared/components/counter-card/counter-card';
import {AddCounterCardModal} from '../../shared/components/add-counter-card-modal/add-counter-card-modal';
import {CounterCardService} from '../../shared/services/counter-card';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [
    RoleCard,
    AddTab,
    GoalTable,
    BlockTable,
    CounterCard
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
  host: { class: 'flex-1 min-w-0' },
})
export class Dashboard implements OnInit {
  private readonly roleService = inject(Role);
  private readonly counterCardService = inject(CounterCardService);
  private readonly dialog = inject(MatDialog);

  readonly roles = this.roleService.roles;
  readonly error = this.roleService.error;

  readonly selectedRoleId = signal<number>(0);
  readonly selectedGoalId = signal<number>(0);

  readonly selectedRoleColor = computed(() =>
    this.roles().find((r) => r.id === this.selectedRoleId())?.color ?? ''
  );


  readonly counterCards = this.counterCardService.counterCards;
  readonly counterCardsError = this.counterCardService.error;

  ngOnInit() {
    this.roleService.loadRoles();
    this.counterCardService.loadCounterCards();
  }

  openAddRole() {
    this.dialog.open(AddRoleModal);
  }

  openAddCounterCard() {
    this.dialog.open(AddCounterCardModal);
  }

  onRoleSelected(id: number) {
    this.selectedRoleId.set(id);
    this.selectedGoalId.set(0);
  }

}
