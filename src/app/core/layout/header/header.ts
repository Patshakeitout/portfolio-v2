import { Component, inject, ChangeDetectionStrategy, signal, HostListener, computed } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderColorService } from '../../services/header-color.service';
import { MobileMenuService } from '../../services/mobile-menu.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private headerColorService = inject(HeaderColorService);
  private mobileMenuService = inject(MobileMenuService);
  private languageService = inject(LanguageService);
  private router = inject(Router);
  public lang = this.languageService.lang;
  public isEnglish = computed(() => this.languageService.lang() === 'en');
  public toggleIcon = computed(() => {
    const side = this.isEnglish() ? 'left' : 'right';
    const theme = this.isHeaderInverted() ? '-dark' : '';
    return `/icons/ui/toggle-lg-${side}${theme}.png`;
  });
  public isHeaderInverted = this.headerColorService.isHeaderInverted.asReadonly();
  public isInContactSection = this.headerColorService.isInContactSection.asReadonly();
  public isOnProjectDetails = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects.includes('/projects/')),
      startWith(this.router.url.includes('/projects/'))
    ),
    { initialValue: this.router.url.includes('/projects/') }
  );

  isMenuOpen = this.mobileMenuService.isOpen;
  isHeaderHidden = signal(false);
  private lastScrollY = 0;

  @HostListener('window:scroll')
  onScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 10) {
      this.isHeaderHidden.set(false);
    } else if (currentScrollY > this.lastScrollY + 10) {
      this.isHeaderHidden.set(true);
    } else if (currentScrollY < this.lastScrollY) {
      this.isHeaderHidden.set(false);
    }

    this.lastScrollY = currentScrollY;
  }

  toggleMenu() {
    this.mobileMenuService.toggle();
  }

  /** Switches the active language. */
  toggleLanguage() {
    this.languageService.toggle();
  }

  /** Smooth-scrolls to a named section, accounting for the fixed header. */
  scrollToSection(fragment: string) {
    const element = document.getElementById(fragment);
    if (!element) return;
    const offsetPosition = element.getBoundingClientRect().top + window.scrollY - 4;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }

  scrollToTop() {
    const start = window.scrollY;
    const duration = 1800;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      window.scrollTo({ top: start * (1 - ease), behavior: 'instant' });
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}
