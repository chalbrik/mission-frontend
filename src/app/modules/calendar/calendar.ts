import {Component, computed, inject, OnInit} from '@angular/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions, EventDropArg, EventInput} from '@fullcalendar/core';
import {DateClickArg} from '@fullcalendar/interaction';
import {AddBlockModal} from '../../shared/components/add-block-modal/add-block-modal';
import plLocale from '@fullcalendar/core/locales/pl'
import { Block } from '../../shared/services/block'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {MatDialog} from '@angular/material/dialog';
import {BlockInterface} from '../../shared/interfaces/block.interface';

const EVENT_COLOR = 'var(--color-surface-brand-default)';

export function blocksToEvents(blocks: BlockInterface[]): EventInput[] {
  return blocks
    .filter((b) => !!b.scheduled_date)
    .map((b) => ({
      id: String(b.id),
      title: b.name,
      start: b.scheduled_date!,
      allDay: true,
      backgroundColor: EVENT_COLOR,
      borderColor: EVENT_COLOR,
    }));
}

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar implements OnInit {
  private readonly blockService = inject(Block);
  private readonly dialog = inject(MatDialog);

  protected readonly calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: plLocale,
    editable: true,
    height: 'auto',
    events: blocksToEvents(this.blockService.calendarBlocks()),
    eventTextColor: 'var(--color-text-default)',
    dateClick: (arg: DateClickArg) => this.dialog.open(AddBlockModal, {data: {date: arg.dateStr}}),
    eventDrop: (arg: EventDropArg) => this.onEventDrop(arg),
  }));

  ngOnInit() {
    this.blockService.loadCalendarBlocks();
  }

  onEventDrop(arg: EventDropArg) {
    this.blockService.scheduleBlock(Number(arg.event.id), arg.event.startStr).subscribe({
      error: () => arg.revert(),   // przy nieudanym PATCH event wraca na miejsce
    });

  }
}
