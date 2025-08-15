import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../service/project.service';
import { CommonModule } from '@angular/common';

import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, CommonModule, CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  projectService = inject(ProjectService);
  fb = inject(FormBuilder);
  visible = false;

  projetosList = this.projectService.projetos;
  formulario() {
    this.visible = !this.visible;
  }
  criar() {
    if (this.form.invalid) return;

    const { nome, description } = this.form.value;
    this.projectService.criar(nome!, description!);
    this.form.reset();
    this.visible = false;
  }

  form = this.fb.group({
    nome: ['', Validators.required],
    description: [''],
  });
}
