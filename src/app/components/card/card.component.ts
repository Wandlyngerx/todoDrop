import { Component, inject, Input } from '@angular/core';
import Projeto from '../../types/Project';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  projectService = inject(ProjectService);
  deletar(id: string) {
    this.projectService.excuirProjeto(id);
  }
  @Input() projeto!: Projeto;
}
