import {Component, computed, input, output} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {LucideDynamicIcon, LucideIconInput} from '@lucide/angular';
import {MatButton} from '@angular/material/button';
import {MatTooltip, TooltipPosition} from '@angular/material/tooltip';

type ButtonType = 'filled' | 'outline' | 'ghost';

interface ButtonColors {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
}

// Wartości przechodzące bez opakowania w var() — reszta gołych nazw traktowana jako token Tailwinda
const CSS_KEYWORDS = new Set(['transparent', 'inherit', 'currentColor']);

// 'red-500' → 'var(--color-red-500)'; pełne wartości CSS (#hex, var(), rgb(), color-mix()...) bez zmian
function resolveColor(value: string): string {
  if (value.includes('(') || value.startsWith('#') || CSS_KEYWORDS.has(value)) {
    return value;
  }
  return `var(--color-${value})`;
}

// Domyślne kolory per typ — każdy można nadpisać inputem (bgColor/textColor/borderColor/hoverBgColor)
const DEFAULT_COLORS: Record<ButtonType, ButtonColors> = {
  filled: {
    bg: 'var(--color-surface-background-brand)',
    text: 'var(--color-text-on-action)',
    border: 'transparent',
    hoverBg: 'var(--color-surface-background-brand)',
  },
  outline: {
    bg: 'transparent',
    text: 'var(--color-text-default)',
    border: 'var(--color-border-default)',
    hoverBg: 'transparent',
  },
  ghost: {
    bg: 'transparent',
    text: 'inherit',
    border: 'transparent',
    hoverBg: 'transparent',
  },
};

@Component({
  selector: 'app-buttons',
  imports: [
    MatButton,
    MatTooltip,
    LucideDynamicIcon,
    NgTemplateOutlet
  ],
  templateUrl: './buttons.html',
  styleUrl: './buttons.scss',
  standalone: true
})
export class Buttons {

  type = input<ButtonType>('outline');
  size = input<'base' | 'small'>('base');
  rounded = input<'small' | 'big'>('small');

  label = input<string | null>(null);
  iconRight = input<LucideIconInput | null>(null);
  iconLeft = input<LucideIconInput | null>(null);

  disabled = input<boolean>(false);
  hover = input<boolean>(true);
  buttonClass = input<string>('');

  // Nadpisanie kolorów — token Tailwinda ('red-500') albo wartość CSS ('#16a34a', 'var(...)'); null = default typu
  bgColor = input<string | null>(null);
  hoverBgColor = input<string | null>(null);
  borderColor = input<string | null>(null);
  textColor = input<string | null>(null);

  tooltip = input<string | null>(null);
  tooltipPosition = input<TooltipPosition>('above');

  buttonClick = output<MouseEvent>();

  protected readonly bg = computed(() => resolveColor(this.bgColor() ?? DEFAULT_COLORS[this.type()].bg));
  protected readonly text = computed(() => resolveColor(this.textColor() ?? DEFAULT_COLORS[this.type()].text));
  protected readonly border = computed(() => resolveColor(this.borderColor() ?? DEFAULT_COLORS[this.type()].border));
  // Bez hoverBgColor hover trzyma przekazane tło, żeby custom kolor nie znikał po najechaniu
  protected readonly hoverBg = computed(() =>
    resolveColor(this.hoverBgColor() ?? this.bgColor() ?? DEFAULT_COLORS[this.type()].hoverBg)
  );

  protected readonly appearance = computed(() => this.type() === 'filled' ? 'filled' : 'outlined');

  protected readonly radius = computed(() => {
    if(this.rounded() === 'small') {
      return '8px'
    }
    if(this.rounded() === 'big') {
      return '9999px'
    }
    return '8px';
  });




  protected readonly iconSize = computed(() => {
    if(this.size() === 'small') {
      return 12;
    }
    if(this.size() === 'base') {
      return 16;
    }
    return 16;
  });

  protected readonly iconStroke = computed(() => {
    if(this.size() === 'small') {
      return 2;
    }
    if(this.size() === 'base') {
      return 3;
    }
    return 2;
  });

  protected readonly padding  = computed(() => {
    if(this.size() === 'small') {
      return '6px 6px'
    }
    if(this.size() === 'base') {
      return '10px 10px';
    }
    return '10px 10px';
  });

  protected readonly textSizeClass = computed(() => {
    if(this.size() === 'small') {
      return 'text-p-sm';
    }
    if(this.size() === 'base') {
      return 'text-p-base';
    }
    return 'text-p-base';
  });


}
