import { Component, AfterViewInit, ElementRef, inject, OnDestroy, NgZone } from '@angular/core';
import { HeroComponent } from './../hero/hero';
import { AboutComponent } from './../about/about';
import { SkillsComponent } from './../skills/skills';
import { ProjectsComponent } from '../projects/projects';
import { ContactComponent } from './../contact/contact';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [HeroComponent, AboutComponent, SkillsComponent, ProjectsComponent, ContactComponent],
  standalone: true,
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef);
  /* Ng-specific service that ng "can see" changes with IntersectionObserver because this
  is outside of ng's "zone". */
  private zone = inject(NgZone);
  private scrollListener?: () => void;
  private isAtBottom = false;

  /**
   * After the view is initialized, sets up an IntersectionObserver to watch for
   * sections that require the header to change color.
   */
  ngAfterViewInit(): void {
    this.setupScrollListener();
  }

  /**
   * Cleans up the IntersectionObserver and scroll listener when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  /**
   * Sets up a scroll listener to detect when the user reaches the bottom of the page.
   * @private
   */
  private setupScrollListener(): void {
    this.scrollListener = () => {
      this.zone.run(() => {
        const wasAtBottom = this.isAtBottom;
        this.isAtBottom = this.isAtBottomOfPage();

        // If bottom state changed, update the header
        if (wasAtBottom !== this.isAtBottom) {
          if (this.isAtBottom) {
          } else {
            // Not at bottom anymore: check if any sections are intersecting
            const sectionsToObserve = this.elementRef.nativeElement.querySelectorAll('.section--invert-color');
            let hasIntersectingSections = false;

            sectionsToObserve.forEach((section: Element) => {
              const rect = section.getBoundingClientRect();
              const headerHeight = 76;
              if (rect.top <= headerHeight && rect.bottom >= 0) {
                hasIntersectingSections = true;
              }
            });
          }
        }
      });
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  /**
   * Checks if the user has scrolled to the bottom of the page.
   * @private
   * @returns {boolean} True if at the bottom of the page
   */
  private isAtBottomOfPage(): boolean {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    // Add a small threshold (10px) to account for subpixel rendering
    const threshold = 10;
    return scrollTop + clientHeight >= scrollHeight - threshold;
  }
}
