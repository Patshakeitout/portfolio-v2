import { Component, signal, computed, HostListener } from '@angular/core';
import { NgOptimizedImage, NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  imports: [NgOptimizedImage, NgClass, TranslatePipe],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class SkillsComponent {
  peelState = signal<0 | 1 | 2>(0);

  /** Translation key for the peel label of the current peel state. */
  peelTextKey = computed(() => `skills.peel${this.peelState()}`);

  peelClass = computed(() => {
    const classes = ['peel--a', 'peel--b', 'peel--c'];
    return classes[this.peelState()];
  });

  onPeel(event: Event) {
    event.stopPropagation();
    // signal expects union type (type cast necessary)
    this.peelState.update(s => (s < 2 ? (s + 1) as 0 | 1 | 2 : 0));
  }

  @HostListener('document:click')
  resetPeel() {
    if (this.peelState() !== 0) {
      this.peelState.set(0);
    }
  }
}
