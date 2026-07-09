import { Component, ElementRef, OnDestroy, OnInit, inject, viewChild } from '@angular/core';

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.html',
  styleUrl: './cursor.scss',
})
export class CursorComponent implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ring = viewChild.required<ElementRef<HTMLElement>>('ring');
  private readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');

  private raf = 0;
  private x = 0;
  private y = 0;
  private targetX = 0;
  private targetY = 0;
  private dotX = 0;
  private dotY = 0;
  private velX = 0;
  private velY = 0;
  private readonly onMove = (event: PointerEvent) => this.track(event);

  ngOnInit(): void {
    document.addEventListener('pointermove', this.onMove);
    this.raf = requestAnimationFrame(() => this.render());
  }

  ngOnDestroy(): void {
    document.removeEventListener('pointermove', this.onMove);
    cancelAnimationFrame(this.raf);
  }

  /** Tracks the pointer position and its velocity for the inner dot. */
  private track(event: PointerEvent): void {
    this.velX = event.clientX - this.targetX;
    this.velY = event.clientY - this.targetY;
    this.targetX = event.clientX;
    this.targetY = event.clientY;
    this.host.nativeElement.classList.add('cursor--visible');
  }

  /** Eases the ring toward the pointer and the dot toward the motion edge. */
  private render(): void {
    this.x += (this.targetX - this.x) * 0.2;
    this.y += (this.targetY - this.y) * 0.2;
    const speed = Math.hypot(this.velX, this.velY) || 1;
    const scale = Math.min(speed, 14) / speed;
    this.dotX += (this.velX * scale - this.dotX) * 0.2;
    this.dotY += (this.velY * scale - this.dotY) * 0.2;
    this.velX *= 0.9;
    this.velY *= 0.9;
    this.applyTransforms();
    this.raf = requestAnimationFrame(() => this.render());
  }

  /** Writes the current ring and dot positions as transforms. */
  private applyTransforms(): void {
    this.ring().nativeElement.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    this.dot().nativeElement.style.transform =
      `translate3d(${this.x + this.dotX}px, ${this.y + this.dotY}px, 0)`;
  }
}
