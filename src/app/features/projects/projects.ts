import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PROJECTS } from '../project-details/projects-data';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-projects',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {
  readonly lang = inject(LanguageService).lang;
  readonly projects = PROJECTS;
}
