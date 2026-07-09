import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, TranslatePipe],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  private readonly translate = inject(TranslateService);

  readonly frontendLetters = this.lettersWithWords('Frontend', 'hero.frontendWords');
  readonly developerLetters = this.lettersWithWords('DEVELOPER', 'hero.developerWords');

  readonly soundOn = signal(false);

  private audioCtx?: AudioContext;
  private readonly melody = [
    261.63, 329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63,
    293.66, 392.0, 440.0, 523.25, 587.33, 659.25, 587.33, 523.25, 440.0,
  ];

  constructor() {
    const unlock = () => this.unlockAudio();
    ['pointerdown', 'keydown'].forEach(evt =>
      document.addEventListener(evt, unlock, { once: true })
    );
  }

  /**
   * Pairs each letter of a word with the translated trait shown on hover.
   */
  private lettersWithWords(text: string, key: string) {
    return toSignal(
      this.translate.stream(key).pipe(
        map((words: string[]) => [...text].map((letter, i) => ({ letter, word: words[i] })))
      ),
      { initialValue: [] as { letter: string; word: string }[] }
    );
  }

  /**
   * Creates and resumes the audio context on the first user gesture.
   */
  private unlockAudio(): void {
    this.audioCtx ??= new AudioContext();
    this.audioCtx.resume();
  }

  /**
   * Plays the pentatonic note mapped to the hovered letter index.
   */
  /**
   * Toggles whether hovering the title letters plays notes.
   */
  toggleSound(): void {
    this.soundOn.update(on => !on);
  }

  playNote(index: number): void {
    const ctx = this.audioCtx;
    if (!this.soundOn() || ctx?.state !== 'running') return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = this.melody[index] / 2;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
