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
import {BlockFormInterface, BlockInterface} from '../../shared/interfaces/block.interface';

const EVENT_COLOR = 'var(--color-surface-brand-default)';

export function blocksToEvents(blocks: BlockInterface[]): EventInput[] {
  return blocks
    .filter((b) => !!b.start_date)
    .map((b) => ({
      id: String(b.id),
      title: b.name,
      start: b.start_date!,
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
    eventDrop: (arg: EventDropArg) => this.onEventDrop(arg),
  }));

  ngOnInit() {
    this.blockService.loadCalendarBlocks();
  }

  onEventDrop(arg: EventDropArg) {
    const e = arg.event;
    const newStart = e.startStr.slice(0, 10);
    const payload: Partial<BlockFormInterface> = { start_date: newStart };

    if (e.end) {
      const endDay = e.endStr.slice(0, 10);
      payload.end_date = e.allDay ? this.addDays(endDay, -1) : endDay;  // odwrotka ekskluzywnego końca
    } else {
      // FC nie ma końca (jednodniowy albo odrzucił zero-length) — jeśli blok w store MA end_date,
      // to był ten sam dzień: przesuń razem, inaczej stary end_date < nowy start_date → 400 → revert
      const block = this.blockService.calendarBlocks().find((b) => b.id === Number(e.id));
      if (block?.end_date) payload.end_date = newStart;
    }

    this.blockService.rescheduleBlock(Number(e.id), payload).subscribe({ error: () => arg.revert() });
  }

  addDays(dateStr: string, n: number): string {
    const d = new Date(dateStr + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
}
