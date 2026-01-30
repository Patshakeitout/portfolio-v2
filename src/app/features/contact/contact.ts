import { Component, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeaderColorService } from '../../core/services/header-color.service';

@Component({
  selector: 'app-contact',
  imports: [NgOptimizedImage],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private headerColorService = inject(HeaderColorService);
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.headerColorService.isInContactSection.set(entry.isIntersecting);
        });
      },
      {
        threshold: 0.3 // Trigger when 30% of the section is visible
      }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
