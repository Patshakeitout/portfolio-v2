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

  isDragging = signal(false);
  private dragStartX = 0;
  private dragStartScroll = 0;

  /** Start click-and-drag scrolling (mouse/pen only; touch scrolls natively). */
  onDragStart(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    const el = event.currentTarget as HTMLElement;
    this.isDragging.set(true);
    this.dragStartX = event.clientX;
    this.dragStartScroll = el.scrollLeft;
    el.setPointerCapture(event.pointerId);
  }

  /** Scroll the carousel by the pointer delta while dragging. */
  onDragMove(event: PointerEvent) {
    if (!this.isDragging()) return;
    const el = event.currentTarget as HTMLElement;
    el.scrollLeft = this.dragStartScroll - (event.clientX - this.dragStartX);
  }

  /** End click-and-drag scrolling and release the pointer. */
  onDragEnd(event: PointerEvent) {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
  }
}
