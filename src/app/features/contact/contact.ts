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


  /**
   * Spins the sticker clockwise or counter-clockwise based on the cursor entry side.
   * @param event - The mouse enter event used to read the cursor position.
   */
  onStickerEnter(event: MouseEvent) {
    const rect = (event.currentTarget as Element).getBoundingClientRect();
    const dir = event.clientX < rect.left + rect.width / 2 ? 'cw' : 'ccw';
    this.stickerDir.set(null);
    setTimeout(() => this.stickerDir.set(dir));
  }


  /** Stops the sticker animation when the cursor leaves. */
  onStickerLeave(): void {
    this.stickerDir.set(null);
  }

  form = new FormGroup({
    name:    new FormControl('', Validators.required),
    email:   new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/)]),
    message: new FormControl('', Validators.required),
    privacy: new FormControl(false, Validators.requiredTrue),
  });


  /**
   * Marks the given control as untouched and refreshes placeholder/error state.
   * @param controlName - The form control name to reset.
   */
  resetTouched(controlName: string): void {
    this.form.get(controlName)?.markAsUntouched();
    this.touchTick.update(v => v + 1);
  }


  /**
   * Marks the given control as touched and refreshes placeholder/error state.
   * @param controlName - The form control name to mark as touched.
   */
  markTouched(controlName: string): void {
    this.form.get(controlName)?.markAsTouched();
    this.touchTick.update(v => v + 1);
  }


  /**
   * Resolves the name field's placeholder key.
   * @returns Translation key for the name placeholder, or its required-error variant.
   */
  namePlaceholder(): string {
    this.touchTick();
    const c = this.form.get('name');
    if (c?.touched && c.hasError('required')) return 'contact.nameError';
    return 'contact.namePlaceholder';
  }


  /**
   * Resolves the email field's placeholder key.
   * @returns Translation key for the email placeholder, or its required-error variant.
   */
  emailPlaceholder(): string {
    this.touchTick();
    const c = this.form.get('email');
    if (c?.touched && c.hasError('required')) return 'contact.emailRequired';
    return 'contact.emailPlaceholder';
  }


  /**
   * Resolves the email field's format-error key.
   * @returns Translation key for the email-format error shown below the field, or empty.
   */
  emailError(): string {
    this.touchTick();
    const c = this.form.get('email');
    if (c?.touched && c.hasError('pattern')) return 'contact.emailInvalid';
    return '';
  }


  /**
   * Resolves the privacy-consent error key after a submit attempt.
   * @returns Translation key for the privacy-consent error, or empty when valid.
   */
  privacyError(): string {
    const c = this.form.get('privacy');
    if (this.submitted() && c?.hasError('required')) return 'contact.privacyError';
    return '';
  }


  /**
   * Resolves the message field's placeholder key.
   * @returns Translation key for the message placeholder, or its required-error variant.
   */
  messagePlaceholder(): string {
    this.touchTick();
    const c = this.form.get('message');
    if (c?.touched && c.hasError('required')) return 'contact.messageError';
    return 'contact.messagePlaceholder';
  }

  /**
   * Validates the form and posts the contact message to the backend.
   * @returns A promise that resolves once the send attempt has settled.
   */
  async submit(): Promise<void> {
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

  /** Observes the section's visibility to toggle the header colour on intersection. */
  ngOnInit(): void {
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

  /** Smoothly animates the window scroll position back to the top. */
  scrollToTop(): void {
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

  /** Disconnects the intersection observer to avoid leaks. */
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
