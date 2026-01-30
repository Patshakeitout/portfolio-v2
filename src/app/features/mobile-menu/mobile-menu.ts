// mobile-menu.ts

import { Component, inject, effect, EffectRef, OnDestroy, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MobileMenuService } from '../../core/services/mobile-menu.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-mobile-menu',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './mobile-menu.html',
  styleUrl: './mobile-menu.scss',
})
export class MobileMenuComponent implements OnDestroy {
  private mobileMenuService = inject(MobileMenuService);
  private effectRef: EffectRef;

  isOpen = this.mobileMenuService.isOpen;
  isEnglish = signal(true);

  constructor() {
    this.effectRef = effect(() => {
      document.body.style.overflow = this.isOpen() ? 'hidden' : '';
    });
  }


  ngOnDestroy() {
    this.effectRef.destroy();
    document.body.style.overflow = '';
  }


  closeMenu() {
    this.mobileMenuService.close();
  }


  scrollToSection(event: Event) {
    const target = event.currentTarget as HTMLAnchorElement;
    const fragment = target.getAttribute('fragment');

    if (fragment) {
      // Close menu first
      this.closeMenu();

      // Wait for menu to close, then scroll
      setTimeout(() => {
        const element = document.getElementById(fragment);
        if (element) {
          const headerOffset = -4; // Fixed header height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }

  toggleLanguage() {
    this.isEnglish.update(value => !value);
    // TODO: Implement actual language switching logic
    console.log('Language switched to:', this.isEnglish() ? 'English' : 'German');
  }
}
