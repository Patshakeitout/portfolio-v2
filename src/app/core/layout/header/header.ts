import { Component, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { HeaderColorService } from '../../services/header-color.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private headerColorService = inject(HeaderColorService);

  /**
   * A signal representing whether the header should be in an inverted color state.
   */
  public isHeaderInverted = this.headerColorService.isHeaderInverted.asReadonly();

  constructor() {
    effect(() => {
      console.log(`HeaderComponent: isHeaderInverted signal is now ${this.isHeaderInverted()}`);
    });
  }
}
