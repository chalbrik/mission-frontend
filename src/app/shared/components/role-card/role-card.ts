import {Component, computed, inject, input, output, signal} from '@angular/core';
import { Buttons } from '../buttons/buttons';
import { LucideCheck, LucideEllipsisVertical } from '@lucide/angular';
import { Role } from '../../services/role';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {AddRoleModal} from '../add-role-modal/add-role-modal';

@Component({
  selector: 'app-role-card',
  imports: [Buttons, MatMenu, MatMenuTrigger, MatMenuItem],
  templateUrl: './role-card.html',
  styleUrl: './role-card.scss',
})
export class RoleCard {
  private readonly roleService = inject(Role);
  private readonly dialog = inject(MatDialog);

  id = input.required<number>();
  title = input<string>('');
  description = input<string>('');
  points = input<number>(0);
  color = input<string>('');
  isSelected = input<boolean>(false);

  readonly selected = output<number>();

  protected readonly error = signal<string | null>(null);

  protected readonly identityColor = computed(() => `var(--color-${this.color()}-500)`);

  protected readonly cardBorderColor = computed(() => this.isSelected() ? this.identityColor() : 'var(--color-border-default)');

  protected readonly selectionRing = computed(() => this.isSelected() ? `0 0 0 2px ${this.identityColor()}` : null);

  deleteRole() {
    this.roleService.deleteRole(this.id()).subscribe({
      error: () => this.error.set('Nie udało się usunąć roli'),
    });
  }

  editRole() {
    this.dialog.open(AddRoleModal, {
      data: { role: { id: this.id(), name: this.title(), note: this.description() } },
    });
  }

  protected readonly LucideCheck = LucideCheck;
  protected readonly LucideEllipsisVertical = LucideEllipsisVertical;
}
