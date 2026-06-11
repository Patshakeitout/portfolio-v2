import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, TranslatePipe],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  readonly frontendLetters = this.lettersWithWords('Frontend', [
    'Focused', 'Reliable', 'Organized', 'Neat', 'Thorough', 'Efficient', 'Nimble', 'Deliberate',
  ]);
  readonly developerLetters = this.lettersWithWords('DEVELOPER', [
    'Detail-oriented', 'Exacting', 'Versatile', 'Empathetic', 'Logical', 'Observant', 'Precise', 'Eager', 'Resilient',
  ]);

  /**
   * Pairs each letter of a word with the trait shown on hover.
   */
  private lettersWithWords(text: string, words: string[]) {
    return [...text].map((letter, i) => ({ letter, word: words[i] }));
  }

  scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
