import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { FooterComponent } from '../../core/layout/footer/footer';

@Component({
  selector: 'app-privacy-policy',
  imports: [RouterLink, TranslatePipe, FooterComponent],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.scss',
})
export class LegalNoticeComponent {
  readonly lang = inject(LanguageService).lang;
}
