import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {Navigation} from '../navigation/navigation';
import {RoleCard} from '../../shared/components/role-card/role-card';
import {AddTab} from '../../shared/components/add-tab/add-tab';
import {Role} from '../../shared/services/role';
import {GoalTable} from '../../shared/components/goal-table/goal-table';
import {AddRoleModal} from '../../shared/components/add-role-modal/add-role-modal';
import {MatDialog} from '@angular/material/dialog';
import {BlockTable} from '../../shared/components/block-table/block-table';

@Component({
  selector: 'app-dashboard',
  imports: [
    Navigation,
    RoleCard,
    AddTab,
    GoalTable,
    BlockTable
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true
})
export class Dashboard implements OnInit {
  private readonly roleService = inject(Role);
  private readonly dialog = inject(MatDialog);

  readonly roles = this.roleService.roles;
  readonly error = this.roleService.error;

  readonly selectedRoleId = signal<number>(0);
  readonly selectedGoalId = signal<number>(0);

  readonly selectedRoleColor = computed(() =>
    this.roles().find((r) => r.id === this.selectedRoleId())?.color ?? ''
  );

  ngOnInit() {
    this.roleService.loadRoles();
  }

  openAddRole() {
    this.dialog.open(AddRoleModal);
  }

  onRoleSelected(id: number) {
    this.selectedRoleId.set(id);
    this.selectedGoalId.set(0);
  }

}
