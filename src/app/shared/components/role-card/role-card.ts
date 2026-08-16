import {Component, inject, input, output, signal} from '@angular/core';
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

  id = input.required<number>();
  title = input<string>('');
  description = input<string>('');
  points = input<number>(0);
  color = input<string>('');
  isSelected = input<boolean>(false);

  readonly selected = output<number>();

  protected readonly error = signal<string | null>(null);

  deleteRole() {
    this.roleService.deleteRole(this.id()).subscribe({
      error: () => this.error.set('Nie udało się usunąć roli'),
    });
  }

  protected readonly LucideCheck = LucideCheck;
  protected readonly LucideEllipsisVertical = LucideEllipsisVertical;
}
