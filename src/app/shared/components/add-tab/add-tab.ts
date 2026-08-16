import {Component, inject, input, output} from '@angular/core';
import {Buttons} from '../buttons/buttons';
import {LucideEllipsisVertical, LucidePlus} from '@lucide/angular';
import {AddRoleModal} from '../add-role-modal/add-role-modal';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-add-tab',
  imports: [
    Buttons
  ],
  templateUrl: './add-tab.html',
  styleUrl: './add-tab.scss',
})
export class AddTab {
  protected readonly LucidePlus = LucidePlus;

  title = input<string>('');

  readonly add = output<void>();

}
