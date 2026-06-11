import { Injectable, inject, signal } from '@angular/core';
import { PRIMARY_OUTLET, Router, UrlTree } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/** The languages this site supports. */
export type Lang = 'de' | 'en';

const STORAGE_KEY = 'lang';

/**
 * Resolves the language to use when the URL carries none.
 * Prefers a previously stored choice, then the browser language, then English.
 *
 * @returns The best-guess starting language.
 */
export function detectInitialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isLang(stored)) return stored;
  return navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en';
}

/**
 * Type guard that narrows an unknown string to a supported {@link Lang}.
 *
 * @param value - The candidate value, e.g. a `:lang` route segment.
 * @returns `true` when the value is `'de'` or `'en'`.
 */
export function isLang(value: string | null | undefined): value is Lang {
  return value === 'de' || value === 'en';
}

/**
 * Holds the active language and keeps the URL, ngx-translate, `<html lang>`
 * and persisted choice in sync. The route guard drives it via {@link activate};
 * the toggle button drives it via {@link toggle}.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  private router = inject(Router);

  private readonly _lang = signal<Lang>('en');

  /** The currently active language, for templates and lang-aware `routerLink`s. */
  readonly lang = this._lang.asReadonly();

  /**
   * Applies a language across the app. Called by the route guard on every
   * `:lang` navigation, so deep links and refreshes stay consistent.
   *
   * @param lang - The language to make active.
   */
  activate(lang: Lang): void {
    this._lang.set(lang);
    this.translate.use(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }

  /**
   * Switches to the other language by navigating to the same page with its
   * first URL segment swapped, keeping the current scroll position.
   * The guard then applies the change.
   */
  toggle(): void {
    const next: Lang = this._lang() === 'en' ? 'de' : 'en';
    const swapped = this.swapLang(this.router.parseUrl(this.router.url), next);
    const scrollY = window.scrollY;
    this.router.navigateByUrl(swapped).then(() =>
      setTimeout(() => window.scrollTo({ top: scrollY, behavior: 'instant' }))
    );
  }

  /**
   * Builds a URL identical to `tree` but with its first path segment set to
   * `lang`, preserving the remaining path, fragment and query params.
   *
   * @param tree - The URL to rewrite.
   * @param lang - The language segment to place first.
   * @returns The rewritten URL.
   */
  swapLang(tree: UrlTree, lang: Lang): UrlTree {
    const segments = tree.root.children[PRIMARY_OUTLET]?.segments ?? [];
    const rest = segments.slice(1).map(segment => segment.path);
    return this.router.createUrlTree(['/', lang, ...rest], {
      fragment: tree.fragment ?? undefined,
      queryParams: tree.queryParams
    });
  }
}
