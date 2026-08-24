import {Component, computed, inject, input, output, signal} from '@angular/core';
import { Buttons } from '../buttons/buttons';
import { LucideCheck, LucideEllipsisVertical } from '@lucide/angular';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {ConfirmationModal} from '../confirmation-modal/confirmation-modal';
import {AddRoleModal} from '../add-role-modal/add-role-modal';

@Component({
  selector: 'app-role-card',
  imports: [Buttons, MatMenu, MatMenuTrigger, MatMenuItem],
  templateUrl: './role-card.html',
  styleUrl: './role-card.scss',
})
export class RoleCard {

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

  deleteRole() {
    this.dialog.open(ConfirmationModal, {
      data: {
        subject: 'role',
        title: 'Usuwanie',
        text: 'Czy na pewno chcesz usunąć role?',
        itemId: this.id()
      },
    })
  }

  editRole() {
    this.dialog.open(AddRoleModal, {
      data: { role: { id: this.id(), name: this.title(), note: this.description() } },
    });
  }

  protected readonly LucideCheck = LucideCheck;
  protected readonly LucideEllipsisVertical = LucideEllipsisVertical;
}
