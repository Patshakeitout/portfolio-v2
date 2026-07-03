import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { FooterComponent } from '../../core/layout/footer/footer';

@Component({
  selector: 'app-privacy-policy',
  imports: [RouterLink, TranslatePipe, FooterComponent],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicyComponent {
  readonly lang = inject(LanguageService).lang;
}
