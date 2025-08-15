import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Task from '../../types/Task';
import { ProjectService } from '../../service/project.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    CdkDropList,
    CdkDrag,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  projectService = inject(ProjectService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  texto = '';
  isEdit = false;
  taskEdit: Task = { id: 0, nome: '', status: 'a fazer', ordem: 0 };

  id = this.route.snapshot.paramMap.get('id');

  projetosList = this.projectService.projetos;
  projetoSelecionado = computed(() => this.projetosList()[parseInt(this.id!)]);

  todo = computed(() =>
    this.projetoSelecionado()
      .tarefas.filter((t) => t.status === 'a fazer')
      .sort((a, b) => a.ordem - b.ordem)
  );

  progress = computed(() =>
    this.projetoSelecionado()
      .tarefas.filter((t) => t.status === 'em processo')
      .sort((a, b) => a.ordem - b.ordem)
  );

  done = computed(() =>
    this.projetoSelecionado()
      .tarefas.filter((t) => t.status === 'concluido')
      .sort((a, b) => a.ordem - b.ordem)
  );

  formulario = this.fb.group({
    nome: [this.texto, Validators.required],
  });

  criarTarefa() {
    if (this.formulario.value.nome) {
      if (this.isEdit) {
        const id = this.taskEdit.id;
        const nome = this.formulario.value.nome!;
        this.projectService.editarTarefa(id, nome, this.projetoSelecionado());
        this.isEdit = false;
        this.formulario.reset();
      } else {
        const nome = this.formulario.value.nome!;
        this.projectService.addTarefa(nome, this.id!);
        this.formulario.reset();
      }
    }
  }

  salvarEdcao(nome: number) {
    this.formulario.setValue(this.projetoSelecionado().tarefas[nome]);
  }

  editar(item: Task) {
    this.isEdit = true;
    this.formulario.setValue({ nome: item.nome });
    this.taskEdit = item;
  }

  teste() {
    console.log('ideiuhdie');
  }

  excluir(item: Task) {
    this.projectService.deleteTask(this.projetoSelecionado(), item);
  }

  drop(event: CdkDragDrop<Task[]>) {
    let novaLista: Task[];

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      novaLista = event.container.data;
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const tarefa = event.container.data[event.currentIndex];

      switch (event.container.id) {
        case 'todo':
          tarefa.status = 'a fazer';
          break;
        case 'inProgress':
          tarefa.status = 'em processo';
          break;
        case 'done':
          tarefa.status = 'concluido';
          break;
      }

      novaLista = event.container.data;
    }

    // Atualiza a ordem com base na posição na lista
    novaLista.forEach((tarefa, index) => {
      tarefa.ordem = index;
    });

    // Salva a lista atualizada no localStorage
    this.projectService.atualizarProjeto(
      this.projetosList()[parseInt(this.id!)]
    );
  }
}
