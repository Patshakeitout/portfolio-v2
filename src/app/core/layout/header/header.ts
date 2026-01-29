import { MobileMenuComponent } from './../../../features/mobile-menu/mobile-menu';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
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

  isMenuOpen = this.mobileMenuService.isOpen;

  toggleMenu() {
    this.mobileMenuService.toggle();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
