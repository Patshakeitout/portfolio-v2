// mobile-menu.ts

import { Component, inject, effect, EffectRef, OnDestroy, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MobileMenuService } from '../../core/services/mobile-menu.service';
import { LanguageService } from '../../core/services/language.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-mobile-menu',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe],
  templateUrl: './mobile-menu.html',
  styleUrl: './mobile-menu.scss',
})
export class MobileMenuComponent implements OnDestroy {
  private mobileMenuService = inject(MobileMenuService);
  private language = inject(LanguageService);
  private effectRef: EffectRef;

  isOpen = this.mobileMenuService.isOpen;
  lang = this.language.lang;
  isEnglish = computed(() => this.language.lang() === 'en');

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
      this.closeMenu();

      setTimeout(() => {
        const element = document.getElementById(fragment);
        if (element) {
          const headerOffset = -4;
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

  /** Switches between German and English via the language service. */
  toggleLanguage() {
    this.language.toggle();
  }
}
