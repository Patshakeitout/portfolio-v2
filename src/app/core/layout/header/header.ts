import { MobileMenuComponent } from './../../../features/mobile-menu/mobile-menu';
import { Component, inject, ChangeDetectionStrategy, signal, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { HeaderColorService } from '../../services/header-color.service';
import { MobileMenuService } from '../../services/mobile-menu.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private headerColorService = inject(HeaderColorService);
  private mobileMenuService = inject(MobileMenuService);
  private router = inject(Router);
  public lang = inject(LanguageService).lang;
  public isHeaderInverted = this.headerColorService.isHeaderInverted.asReadonly();
  public isInContactSection = this.headerColorService.isInContactSection.asReadonly();
  public isOnProjectDetails = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects.startsWith('/projects/')),
      startWith(this.router.url.startsWith('/projects/'))
    ),
    { initialValue: this.router.url.startsWith('/projects/') }
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

  scrollToTop() {
    const start = window.scrollY;
    const duration = 1200;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, start * (1 - ease));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}
