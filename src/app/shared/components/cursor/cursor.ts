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
  private readonly imageContexts = new Map<string, CanvasRenderingContext2D | null>();
  private readonly onMove = (event: PointerEvent) => this.track(event);

  ngOnInit(): void {
    document.addEventListener('pointermove', this.onMove);
    this.raf = requestAnimationFrame(() => this.render());
  }

  ngOnDestroy(): void {
    document.removeEventListener('pointermove', this.onMove);
    cancelAnimationFrame(this.raf);
  }

  private syncCursorColor(x: number, y: number): void {
    const color = this.getBackgroundColorAtPoint(x, y);

    this.host.nativeElement.style.setProperty('--cursor-color', color === 'dark' ? '#fff' : '#111');
  }

  private getBackgroundColorAtPoint(x: number, y: number): 'dark' | 'light' {
    const host = this.host.nativeElement;

    host.style.visibility = 'hidden';

    const element = document.elementFromPoint(x, y) as HTMLElement | null;

    host.style.visibility = '';

    if (!element) {
      return 'dark';
    }

    let current: HTMLElement | null = element;

    while (current) {
      const style = getComputedStyle(current);

      const bg = style.backgroundColor;

      if (bg && bg !== 'transparent' && !bg.includes('rgba(0, 0, 0, 0)')) {
        const rgb = this.parseRGB(bg);

        if (rgb) {
          return this.getBrightness(rgb) > 160 ? 'light' : 'dark';
        }
      }

      current = current.parentElement;
    }

    return 'dark';
  }

  /** Tracks the pointer position and its velocity for the inner dot. */
  private track(event: PointerEvent): void {
    this.velX = event.clientX - this.targetX;
    this.velY = event.clientY - this.targetY;

    this.targetX = event.clientX;
    this.targetY = event.clientY;

    this.host.nativeElement.classList.add('cursor--visible');

    this.syncCursorColor(event.clientX, event.clientY);
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
    this.dot().nativeElement.style.transform = `translate3d(${this.x + this.dotX}px, ${this.y + this.dotY}px, 0)`;
  }

  private parseRGB(color: string): [number, number, number] | null {
    const values = color.match(/\d+/g);

    if (!values || values.length < 3) {
      return null;
    }

    return [Number(values[0]), Number(values[1]), Number(values[2])];
  }

  private getBrightness(rgb: [number, number, number]): number {
    const [r, g, b] = rgb;

    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  private samplePixel(x: number, y: number): 'dark' | 'light' {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return 'dark';
    }

    canvas.width = 1;
    canvas.height = 1;

    try {
      ctx.drawImage(document.elementFromPoint(x, y) as CanvasImageSource, 0, 0);

      const pixel = ctx.getImageData(0, 0, 1, 1).data;

      return this.getBrightness([pixel[0], pixel[1], pixel[2]]) > 160 ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  }
}
