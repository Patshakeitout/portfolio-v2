import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PROJECTS } from '../project-details/projects-data';

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {
  private router = inject(Router);
  readonly projects = PROJECTS;

  private pressTimer: ReturnType<typeof setTimeout> | null = null;

  startPress(event: PointerEvent, slug: string) {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    const el = event.currentTarget as HTMLElement;
    el.classList.add('is-pressing');
    this.cancelPressTimer();
    this.pressTimer = setTimeout(() => {
      this.pressTimer = null;
      this.router.navigate(['/projects', slug]);
    }, 1400);
  }

  cancelPress(event: PointerEvent) {
    const el = event.currentTarget as HTMLElement;
    el.classList.remove('is-pressing');
    this.cancelPressTimer();
  }

  blockClick(event: MouseEvent) {
    event.preventDefault();
  }

  private cancelPressTimer() {
    if (this.pressTimer !== null) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }
}
