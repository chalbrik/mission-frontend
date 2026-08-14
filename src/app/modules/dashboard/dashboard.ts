import { Component } from '@angular/core';
import {Navigation} from '../navigation/navigation';
import {RoleCard} from '../../shared/components/role-card/role-card';
import {AddTab} from '../../shared/components/add-tab/add-tab';

@Component({
  selector: 'app-dashboard',
  imports: [
    Navigation,
    RoleCard,
    AddTab
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true
})
export class Dashboard {

}
