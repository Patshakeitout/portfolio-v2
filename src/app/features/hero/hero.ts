import { Component, inject } from '@angular/core';
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

  scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
