import {Component, input} from '@angular/core';
import {Buttons} from '../buttons/buttons';
import {LucideAArrowUp, LucideCheck, LucideEllipsisVertical} from '@lucide/angular';

@Component({
  selector: 'app-role-card',
  imports: [
    Buttons
  ],
  templateUrl: './role-card.html',
  styleUrl: './role-card.scss',
  standalone: true
})
export class RoleCard {

  title = input<string>('');
  description = input<string>('');
  color = input<string>('');

  protected readonly LucideAArrowUp = LucideAArrowUp;
  protected readonly LucideCheck = LucideCheck;
  protected readonly LucideEllipsisVertical = LucideEllipsisVertical;
}
