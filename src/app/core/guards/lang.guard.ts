import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LanguageService, detectInitialLang, isLang } from '../services/language.service';

/**
 * Guards every `:lang` route. Activates the language when the segment is
 * supported, otherwise redirects to the same page in the default language.
 *
 * @param route - The activated route snapshot carrying the `:lang` param.
 * @returns `true` to proceed, or a `UrlTree` redirect for an unknown language.
 */
export const langGuard: CanActivateFn = route => {
  const router = inject(Router);
  const language = inject(LanguageService);
  const lang = route.paramMap.get('lang');

  if (isLang(lang)) {
    language.activate(lang);
    return true;
  }

  const navigation = router.getCurrentNavigation();
  const tree = navigation?.finalUrl ?? router.parseUrl(router.url);
  return language.swapLang(tree, detectInitialLang());
};
