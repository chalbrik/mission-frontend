import {Component, inject, input} from '@angular/core';
import {Buttons} from "../buttons/buttons";
import {LucideCrown, LucideEllipsisVertical, LucideEyeClosed} from '@lucide/angular';
import {CounterCardService} from '../../services/counter-card';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-counter-card',
  imports: [
    Buttons,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './counter-card.html',
  styleUrl: './counter-card.scss',
})
export class CounterCard {
  protected readonly LucideCrown = LucideCrown;
  protected readonly LucideEyeClosed = LucideEyeClosed;

  readonly id = input<number>(0);
  readonly title = input<string>('');
  readonly streak = input<number>(0);
  readonly record = input<number>(0);

  private counterCardService = inject(CounterCardService);

  markSuccess(){
    this.counterCardService.markSuccess(this.id()).subscribe({
      next: ()=> {
      },
      error: ()=> {
        console.error('Nie udało się odłożyć wartości');
      },
    });

  }

  reset(){
    this.counterCardService.reset(this.id()).subscribe({
      next: ()=> {
        console.log('poszlo')
      },
      error: ()=> {
        console.error('Nie udało się zresetować wartości');
      },
    });
  }

  editCounterCard(){

  }

  deleteCounterCard(){

  }


  protected readonly LucideEllipsisVertical = LucideEllipsisVertical;
}
