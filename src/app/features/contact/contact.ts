import { Component, ElementRef, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeaderColorService } from '../../core/services/header-color.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-contact',
  imports: [NgOptimizedImage, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private headerColorService = inject(HeaderColorService);
  private http = inject(HttpClient);
  public lang = inject(LanguageService).lang;
  private observer?: IntersectionObserver;

  status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  stickerDir = signal<'cw' | 'ccw' | null>(null);
  submitted = signal(false);
  private touchTick = signal(0);

  onStickerEnter(event: MouseEvent) {
    const rect = (event.currentTarget as Element).getBoundingClientRect();
    const dir = event.clientX < rect.left + rect.width / 2 ? 'cw' : 'ccw';
    this.stickerDir.set(null);
    setTimeout(() => this.stickerDir.set(dir));
  }

  onStickerLeave() {
    this.stickerDir.set(null);
  }

  form = new FormGroup({
    name:    new FormControl('', Validators.required),
    email:   new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/)]),
    message: new FormControl('', Validators.required),
    privacy: new FormControl(false, Validators.requiredTrue),
  });

  resetTouched(controlName: string) {
    this.form.get(controlName)?.markAsUntouched();
    this.touchTick.update(v => v + 1);
  }

  markTouched(controlName: string) {
    this.form.get(controlName)?.markAsTouched();
    this.touchTick.update(v => v + 1);
  }

  /** Translation key for the name placeholder, or its required-error variant. */
  namePlaceholder(): string {
    this.touchTick();
    const c = this.form.get('name');
    if (c?.touched && c.hasError('required')) return 'contact.nameError';
    return 'contact.namePlaceholder';
  }

  /** Translation key for the email placeholder, or its required-error variant. */
  emailPlaceholder(): string {
    this.touchTick();
    const c = this.form.get('email');
    if (c?.touched && c.hasError('required')) return 'contact.emailRequired';
    return 'contact.emailPlaceholder';
  }

  /** Translation key for the email-format error shown below the field, or empty. */
  emailError(): string {
    this.touchTick();
    const c = this.form.get('email');
    if (c?.touched && c.hasError('pattern')) return 'contact.emailInvalid';
    return '';
  }

  /** Translation key for the privacy-consent error, or empty when valid. */
  privacyError(): string {
    const c = this.form.get('privacy');
    if (this.submitted() && c?.hasError('required')) return 'contact.privacyError';
    return '';
  }

  /** Translation key for the message placeholder, or its required-error variant. */
  messagePlaceholder(): string {
    this.touchTick();
    const c = this.form.get('message');
    if (c?.touched && c.hasError('required')) return 'contact.messageError';
    return 'contact.messagePlaceholder';
  }

  async submit() {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    this.touchTick.update(v => v + 1);
    if (this.form.invalid) return;


    this.status.set('sending');

    try {
      await firstValueFrom(
        this.http.post('https://v2.patrickschauer.de/api/contact.php', this.form.value)
      );
      this.status.set('success');
      this.submitted.set(false);
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

  scrollToTop() {
    const start = window.scrollY;
    const duration = 1200;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, start * (1 - ease));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
