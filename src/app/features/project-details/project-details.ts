import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PROJECTS } from './projects-data';
import { LanguageService } from '../../core/services/language.service';
import { FooterComponent } from '../../core/layout/footer/footer';

@Component({
  selector: 'app-project-details',
  imports: [RouterLink, TranslatePipe, FooterComponent],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetails {
  readonly lang = inject(LanguageService).lang;
  readonly slug = input.required<string>();

  readonly project = computed(() =>
    PROJECTS.find(project => project.slug === this.slug())
  );

  readonly nextSlug = computed(() => {
    const index = PROJECTS.findIndex(project => project.slug === this.slug());
    if (index === -1 || index >= PROJECTS.length - 1) return null;
    return PROJECTS[index + 1].slug;
  });

  private readonly techIcons: Record<string, string> = {
    Angular: 'ng',
    TypeScript: 'ts',
    SCSS: 'css',
    Supabase: 'supabase',
    'HTML5 Canvas': 'html',
    JavaScript: 'js',
  };

  /** Returns the icon path for a tech name, or null when none exists. */
  techIcon(tech: string): string | null {
    const name = this.techIcons[tech];
    return name ? `/icons/tech/${name}.svg` : null;
  }
}
