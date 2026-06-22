import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Service to manage the header color state based on the underlying section.
 */
@Injectable({
  providedIn: 'root'
})
export class HeaderColorService {

  public isHeaderInverted = signal(false);
  public isInContactSection = signal(false);
  public isProjectDetails = signal(false);

  constructor() {
    inject(Router).events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.isProjectDetails.set(event.urlAfterRedirects.includes('/projects/')));
  }

}
