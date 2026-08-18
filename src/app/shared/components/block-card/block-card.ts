import {Component, inject, input, signal} from '@angular/core';
import {Buttons} from "../buttons/buttons";
import {MatCheckbox} from "@angular/material/checkbox";
import {BlockInterface} from '../../interfaces/block.interface';
import { LucideTrash2 } from '@lucide/angular';
import {ConfirmationModal} from '../confirmation-modal/confirmation-modal';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-block-card',
    imports: [
        Buttons,
        MatCheckbox
    ],
  templateUrl: './block-card.html',
  styleUrl: './block-card.scss',
})
export class BlockCard {
  protected readonly LucideTrash2 = LucideTrash2;
  private readonly dialog = inject(MatDialog);

  block = input.required<BlockInterface>();

  isSelected = input<boolean>(false);

  protected readonly completed = signal(false);

  // complete() {
  //   if (this.completed()) return;
  //   this.completed.set(true);
  //
  //   this.blockService.completeBlock(this.block().id, this.block().role).subscribe({
  //     error: () => this.completed.set(false),
  //   });
  // }

  deleteBlock() {
    this.dialog.open(ConfirmationModal, {
      data: {
        subject: 'block',
        title: 'Usuwanie',
        text: 'Czy na pewno chcesz usunąć zadanie?',
        itemId: this.block().id
      },
    })
  }
}
