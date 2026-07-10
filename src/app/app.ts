import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { HeaderComponent } from "./core/layout/header/header";
import { MobileMenuComponent } from "./features/mobile-menu/mobile-menu";
import { CursorComponent } from "./shared/components/cursor/cursor";


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    MobileMenuComponent,
    CursorComponent
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('portfolio');
  private translate = inject(TranslateService);

  /**
   * Prints a styled credits message to the browser developer console.
   *
   * @param credits - The localized credits line.
   */
  private printConsoleCredits(credits: string): void {
    console.log(
      '\n%c  ❤  %c  </>  %c\n\n' + credits + '\n\n' +
      '%c DA %c Academy  %c https://developerakademie.com/',
      'background:#e74c3c; color:#fff; font-size: 12px; padding: 3px 1px; border-radius: 4px 0 0 4px;',
      'background:#2c3e50; color:#3498db; font-size: 12px; font-weight:bold; padding: 3px 1px; border-radius: 0 4px 4px 0;',
      'color:#f0c040; font-size: 13px; font-weight:bold; line-height: 1.4;',
      'color:#e94560; font-size:10px; font-weight:bold;',
      'color:#aaa; font-weight:bold; font-size:10px;',
      'color:#ccc; font-size:10px;'
    );
  }

  ngOnInit(): void {
    this.translate.get('console.credits')
      .subscribe(credits => this.printConsoleCredits(credits));
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
