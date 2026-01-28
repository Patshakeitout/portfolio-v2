import { Injectable, signal } from '@angular/core';

/**
 * Service to manage the header color state based on the underlying section.
 */
@Injectable({
  providedIn: 'root'
})
export class HeaderColorService {

  public isHeaderInverted = signal(false);

}
