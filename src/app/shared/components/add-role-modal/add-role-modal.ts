import {Component, inject, OnInit, signal} from '@angular/core';
import {Role} from '../../services/role';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {Buttons} from '../buttons/buttons';
import {LucideCheck, LucidePlus, LucideX} from '@lucide/angular';
import {RoleFormInterface, RoleInterface} from '../../interfaces/role.interface';
import {form, FormField, required, submit} from '@angular/forms/signals';
import {firstValueFrom} from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

@Component({
  selector: 'app-add-role-modal',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, Buttons, FormField, MatDialogActions, MatDialogContent, MatDialogTitle],
  templateUrl: './add-role-modal.html',
  styleUrl: './add-role-modal.scss',
})
export class AddRoleModal {
  private readonly roleService = inject(Role);
  protected readonly dialogRef = inject(MatDialogRef<AddRoleModal>);
  protected readonly data = inject<{ role?: RoleInterface }>(MAT_DIALOG_DATA, { optional: true });

  protected readonly error = signal<string | null>(null);

  roleModel = signal<RoleFormInterface>(
    {
      name: this.data?.role?.name ?? '',
      note: this.data?.role?.note ?? ''
    }
  );

  roleForm = form(this.roleModel, (path) => {
    required(path.name, { message: 'Nazwa roli jest wymagana' });
  });

  createRole(event: Event) {
    event.preventDefault();
    submit(this.roleForm, {
      action: async () => {
        try {
          const role = this.data?.role;
          if (role) {
            await firstValueFrom(this.roleService.editRole(role.id, this.roleModel()));
          } else {
            await firstValueFrom(this.roleService.createRole(this.roleModel()));
          }
          this.dialogRef.close();
        } catch {
          this.error.set('Nie udało się zapisać roli');
        }
      }
    });
  }


  protected readonly LucideX = LucideX;
  protected readonly LucideCheck = LucideCheck;
}
