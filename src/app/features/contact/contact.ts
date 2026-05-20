import { Component, ElementRef, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeaderColorService } from '../../core/services/header-color.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact',
  imports: [NgOptimizedImage, ReactiveFormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private headerColorService = inject(HeaderColorService);
  private http = inject(HttpClient);
  private observer?: IntersectionObserver;

  status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');

  form = new FormGroup({
    name:    new FormControl('', Validators.required),
    email:   new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', Validators.required),
    privacy: new FormControl(false, Validators.requiredTrue),
  });

  async submit() {
    if (this.form.invalid) return;
    this.status.set('sending');

    try {
      await firstValueFrom(
        this.http.post('https://v2.patrickschauer.de/api/contact.php', this.form.value)
      );
      this.status.set('success');
      this.form.reset();
    } catch {
      this.status.set('error');
    }
  }

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
