import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from './projects-data';

@Component({
  selector: 'app-project-details',
  imports: [RouterLink],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetails {
  readonly slug = input.required<string>();

  readonly project = computed(() =>
    PROJECTS.find(project => project.slug === this.slug())
  );

  readonly prevSlug = computed(() => {
    const index = PROJECTS.findIndex(project => project.slug === this.slug());
    if (index <= 0) return null;
    return PROJECTS[index - 1].slug;
  });

  readonly nextSlug = computed(() => {
    const index = PROJECTS.findIndex(project => project.slug === this.slug());
    if (index === -1 || index >= PROJECTS.length - 1) return null;
    return PROJECTS[index + 1].slug;
  });
}
