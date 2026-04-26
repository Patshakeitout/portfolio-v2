import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../project-details/projects-data';

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {
  readonly projects = PROJECTS;
}
