import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from "./core/layout/header/header";
import { MobileMenuComponent } from "./features/mobile-menu/mobile-menu";


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    MobileMenuComponent
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('portfolio');

  ngOnInit(): void {
    const link = document.querySelector<HTMLLinkElement>("link[rel='icon']")!;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const BLUE = { r: 0x33, g: 0x55, b: 0xFF };
      const YELLOW = { r: 0xF7, g: 0xC5, b: 0x18 };
      const PERIOD = 10000;

      const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

      const animate = (timestamp: number) => {
        const t = (Math.sin((timestamp / PERIOD) * Math.PI * 2) + 1) / 2;
        const r = lerp(BLUE.r, YELLOW.r, t);
        const g = lerp(BLUE.g, YELLOW.g, t);
        const b = lerp(BLUE.b, YELLOW.b, t);

        ctx.clearRect(0, 0, 32, 32);
        ctx.drawImage(img, 0, 0, 32, 32);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, 0, 32, 32);
        ctx.globalCompositeOperation = 'source-over';

        link.href = canvas.toDataURL();
        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    };
    img.src = '/favicon.ico';
  }
}
