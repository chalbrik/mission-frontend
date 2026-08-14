import {Component, input} from '@angular/core';
import {Buttons} from '../buttons/buttons';
import {LucideEllipsisVertical, LucidePlus} from '@lucide/angular';

@Component({
  selector: 'app-add-tab',
  imports: [
    Buttons
  ],
  templateUrl: './add-tab.html',
  styleUrl: './add-tab.scss',
})
export class AddTab {
  title = input<string>('');
  protected readonly LucideEllipsisVertical = LucideEllipsisVertical;
  protected readonly LucidePlus = LucidePlus;
}
