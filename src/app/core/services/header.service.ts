import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  readonly inverted = signal(false);


  /**
   * Updates the inverted state of the header color (menu color).
   *
   * @param isInverted - If `true`, the header toggles color to white.
   * If `false`, it uses the default styling black.
   */
  setInverted(isInverted: boolean) {
    this.inverted.set(isInverted);
  }
}
