import { MobileMenuComponent } from './../../../features/mobile-menu/mobile-menu';
import { Component, inject, ChangeDetectionStrategy, signal, HostListener } from '@angular/core';
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
  public isHeaderInverted = this.headerColorService.isHeaderInverted.asReadonly();
  public isInContactSection = this.headerColorService.isInContactSection.asReadonly();

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
