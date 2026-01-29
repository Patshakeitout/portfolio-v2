// mobile-menu.ts

import { Component, inject, effect, EffectRef, OnDestroy } from '@angular/core';
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
  isOpen = this.mobileMenuService.isOpen;
  private effectRef: EffectRef;

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
}
