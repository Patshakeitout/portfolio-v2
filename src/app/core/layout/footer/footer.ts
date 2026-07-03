import { Component, Input, booleanAttribute, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  readonly lang = inject(LanguageService).lang;
  @Input() theme: 'light' | 'dark' = 'light';
  @Input({ transform: booleanAttribute }) adaptive = false;

  /** Scrolls the window back to the top at a steady, unhurried pace. */
  scrollToTop(): void {
    const start = window.scrollY;
    const duration = Math.min(1400, Math.max(500, start / 2));
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, start * (1 - progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}
