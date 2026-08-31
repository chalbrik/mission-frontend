import {Component, computed, inject, input, OnInit, signal} from '@angular/core';
import {Buttons} from "../buttons/buttons";
import {MatCheckbox} from "@angular/material/checkbox";
import {BlockInterface} from '../../interfaces/block.interface';
import {LucidePencil, LucideTrash2} from '@lucide/angular';
import {ConfirmationModal} from '../confirmation-modal/confirmation-modal';
import {MatDialog} from '@angular/material/dialog';
import {Block} from '../../services/block'
import {AddBlockModal} from '../add-block-modal/add-block-modal';

@Component({
  selector: 'app-block-card',
    imports: [
        Buttons,
        MatCheckbox
    ],
  templateUrl: './block-card.html',
  styleUrl: './block-card.scss',
})
export class BlockCard implements OnInit {
  protected readonly LucideTrash2 = LucideTrash2;
  private readonly dialog = inject(MatDialog);
  private readonly blockService = inject(Block);

  block = input.required<BlockInterface>();
  color = input<string>("");

  protected readonly identityColor = computed(() => `var(--color-${this.color()}-500)`);

  protected readonly completed = signal(false);

  ngOnInit() {
    this.completed.set(this.block().completed);
  }

  complete() {
    this.completed.set(!this.completed());
    this.blockService.completeBlock(this.block().id, this.completed()).subscribe({
      error: () => this.completed.set(false),
    });
  }

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

  editBlock() {
    this.dialog.open(AddBlockModal, {
      data: {
        goalId: this.block().id,
        block: this.block()
      }
    })
  }

  protected readonly LucidePencil = LucidePencil;
}
