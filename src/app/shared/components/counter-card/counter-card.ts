import { Component } from '@angular/core';
import {Buttons} from "../buttons/buttons";
import {LucideCrown, LucideEyeClosed} from '@lucide/angular';

@Component({
  selector: 'app-counter-card',
    imports: [
        Buttons
    ],
  templateUrl: './counter-card.html',
  styleUrl: './counter-card.scss',
})
export class CounterCard {
  protected readonly LucideCrown = LucideCrown;
  protected readonly LucideEyeClosed = LucideEyeClosed;



}
