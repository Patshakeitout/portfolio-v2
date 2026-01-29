// mobile-menu.service.ts

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MobileMenuService {
  isOpen = signal(false);

  toggle() {
    this.isOpen.update(val => !val);
  }

  close() {
    this.isOpen.set(false);
  }
}
