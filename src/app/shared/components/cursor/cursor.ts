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

  /** Applies the cursor color that contrasts with the background under the pointer. */
  private syncCursorColor(x: number, y: number): void {
    const color = this.getBackgroundColorAtPoint(x, y);

    this.host.nativeElement.style.setProperty('--cursor-color', color === 'dark' ? '#fff' : '#111');
  }

  /** Classifies the topmost visible pixel or color in the full stack under the pointer. */
  private getBackgroundColorAtPoint(x: number, y: number): 'dark' | 'light' {
    for (const el of this.stackAt(x, y)) {
      const style = getComputedStyle(el);
      const rgb = this.samplePoint(el, style, x, y) ?? this.opaqueColor(style.backgroundColor);

      if (rgb) {
        return this.getBrightness(rgb) > 160 ? 'light' : 'dark';
      }
    }

    return 'light';
  }

  /** Collects the hit-test stack plus negative z-index background children under the point. */
  private stackAt(x: number, y: number): HTMLElement[] {
    const stack: HTMLElement[] = [];

    for (const el of document.elementsFromPoint(x, y) as HTMLElement[]) {
      stack.push(el);

      for (const child of Array.from(el.children) as HTMLElement[]) {
        if (Number(getComputedStyle(child).zIndex) < 0 && !stack.includes(child) && this.containsPoint(child, x, y)) {
          stack.push(child);
        }
      }
    }

    return stack;
  }

  /** Checks whether the element's bounding box contains the viewport point. */
  private containsPoint(el: HTMLElement, x: number, y: number): boolean {
    const rect = el.getBoundingClientRect();

    return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom;
  }

  /** Samples the image pixel under the pointer; null when absent, loading or transparent. */
  private samplePoint(el: HTMLElement, style: CSSStyleDeclaration, x: number, y: number): [number, number, number] | null {
    const src = el instanceof HTMLImageElement
      ? el.currentSrc
      : /url\("?([^")]+)"?\)/.exec(style.backgroundImage)?.[1];
    const ctx = src ? this.imageContext(src) : null;

    if (!ctx) {
      return null;
    }

    const rect = el.getBoundingClientRect();
    const u = Math.min(63, Math.max(0, Math.round(((x - rect.left) / rect.width) * 64)));
    const v = Math.min(63, Math.max(0, Math.round(((y - rect.top) / rect.height) * 64)));
    const data = ctx.getImageData(u, v, 1, 1).data;

    return data[3] > 127 ? [data[0], data[1], data[2]] : null;
  }

  /** Returns a cached 64x64 sampling canvas for the image, loading it on first request. */
  private imageContext(src: string): CanvasRenderingContext2D | null {
    if (this.imageContexts.has(src)) {
      return this.imageContexts.get(src) ?? null;
    }

    this.imageContexts.set(src, null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => this.imageContexts.set(src, this.drawToCanvas(img));
    img.src = src;

    return null;
  }

  /** Draws the image onto a small offscreen canvas used for pixel lookups. */
  private drawToCanvas(img: HTMLImageElement): CanvasRenderingContext2D | null {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx?.drawImage(img, 0, 0, 64, 64);

    return ctx;
  }

  /** Parses a CSS color string, returning null for transparent values. */
  private opaqueColor(color: string): [number, number, number] | null {
    const values = color.match(/[\d.]+/g)?.map(Number);

    if (!values || values.length < 3 || values[3] === 0) {
      return null;
    }

    return [values[0], values[1], values[2]];
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

  /** Returns the perceived brightness (0-255) of an RGB color. */
  private getBrightness(rgb: [number, number, number]): number {
    const [r, g, b] = rgb;

    return (r * 299 + g * 587 + b * 114) / 1000;
  }

}
