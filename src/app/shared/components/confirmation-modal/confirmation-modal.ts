import {Component, inject, input} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {Goal} from '../../services/goal';
import {Buttons} from '../buttons/buttons';
import {Role} from '../../services/role';
import {Block} from "../../services/block";
import {LucideCheck, LucideX} from '@lucide/angular';

@Component({
  selector: 'app-confirmation-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    Buttons
  ],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss',
})
export class ConfirmationModal {
  protected readonly dialogRef = inject(MatDialogRef<ConfirmationModal>);
  protected readonly data = inject<{
    subject: string;
    title: string;
    text: string;
    itemId: number
  }>(MAT_DIALOG_DATA);
  private readonly goalService = inject(Goal);
  private readonly roleService = inject(Role);
  private readonly blockService = inject(Block);

  onConfirm() {

    if(this.data.subject === "role"){
      this.roleService.deleteRole(this.data.itemId).subscribe({
        next: () => this.dialogRef.close(),
        error: () => console.error('Nie udało się usunąć roli'),
      });
    }

    if(this.data.subject === "goal"){
      this.goalService.deleteGoal(this.data.itemId).subscribe({
        next: () => this.dialogRef.close(),
        error: () => console.error('Nie udało się usunąć celu'),
      });
    }

    if(this.data.subject === "block"){
      this.blockService.deleteBlock(this.data.itemId).subscribe({
        next: () => this.dialogRef.close(),
        error: () => console.error('Nie udało się usunąć zadania'),
      });
    }

  }

  onCancel() {
    this.dialogRef.close();
  }


  protected readonly LucideCheck = LucideCheck;
  protected readonly LucideX = LucideX;
}
