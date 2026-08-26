import {Component, computed, effect, inject, input} from '@angular/core';
import {AddTab} from "../add-tab/add-tab";
import {GoalCard} from "../goal-card/goal-card";
import {MatDialog} from '@angular/material/dialog';
import {Block} from '../../services/block';
import {AddBlockModal} from '../add-block-modal/add-block-modal';
import {BlockCard} from '../block-card/block-card';


@Component({
  selector: 'app-block-table',
  imports: [
    AddTab,
    BlockCard
  ],
  templateUrl: './block-table.html',
  styleUrl: './block-table.scss',
})
export class BlockTable {
  private readonly dialog = inject(MatDialog);
  private readonly blockService = inject(Block);

  goalId = input.required<number>();
  color = input<string>('');

  readonly blocks = this.blockService.blocks;
  readonly error = this.blockService.error;

  protected readonly identityColor = computed(() => `var(--color-${this.color()}-500)`);

  constructor() {
    effect(() => {
      this.blockService.loadBlocks(this.goalId());
      console.log("blocks: ", this.blocks());
    });
  }

  openAddBlock() {
    this.dialog.open(AddBlockModal, { data: { goalId: this.goalId() } });
  }
}
