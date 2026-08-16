import {Component, inject, input, signal} from '@angular/core';
import {Buttons} from "../buttons/buttons";
import {MatCheckbox} from "@angular/material/checkbox";
import {Block} from '../../services/block';
import {BlockInterface} from '../../interfaces/block.interface';
import { LucideTrash2 } from '@lucide/angular';

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
  private readonly blockService = inject(Block);

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

  deleteBlock(block: BlockInterface) {
    this.blockService.deleteBlock(this.block().id).subscribe({
      error: () => console.error('Nie udało się usunąć zadania'),
    });
  }
}
