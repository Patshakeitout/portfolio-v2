import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  private readonly router = inject(Router);
  readonly lang = inject(LanguageService).lang;
  readonly slug = input.required<string>();
  readonly projects = PROJECTS;

  readonly project = computed(() =>
    PROJECTS.find(project => project.slug === this.slug())
  );

  private readonly index = computed(() =>
    PROJECTS.findIndex(project => project.slug === this.slug())
  );

  readonly nextSlug = computed(() =>
    PROJECTS[(this.index() + 1) % PROJECTS.length].slug
  );

  readonly prevSlug = computed(() =>
    PROJECTS[(this.index() - 1 + PROJECTS.length) % PROJECTS.length].slug
  );

  private readonly techIcons: Record<string, string> = {
    Angular: 'ng',
    TypeScript: 'ts',
    SCSS: 'css',
    Supabase: 'supabase',
    'HTML5 Canvas': 'html',
    JavaScript: 'js',
  };

  /** Navigates to a sibling project, preserving the active language. */
  goTo(slug: string): void {
    this.router.navigate(['/', this.lang(), 'projects', slug]);
  }

  /** Returns the icon path for a tech name, or null when none exists. */
  techIcon(tech: string): string | null {
    const name = this.techIcons[tech];
    return name ? `/icons/tech/${name}.svg` : null;
  }
}
