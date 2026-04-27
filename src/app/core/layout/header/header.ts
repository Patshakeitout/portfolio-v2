import { MobileMenuComponent } from './../../../features/mobile-menu/mobile-menu';
import { Component, inject, ChangeDetectionStrategy, signal, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { HeaderColorService } from '../../services/header-color.service';
import { MobileMenuService } from '../../services/mobile-menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private headerColorService = inject(HeaderColorService);
  private mobileMenuService = inject(MobileMenuService);
  private router = inject(Router);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
