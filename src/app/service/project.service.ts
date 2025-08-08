import { Injectable, signal } from '@angular/core';
import Projeto from '../types/Project';
import Task from '../types/Task';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor() {}

  buscar(): Projeto[] {
    return JSON.parse(localStorage.getItem('project') || '[]');
  }
  projetos = signal<Projeto[]>(this.buscar());

  criar(nome: string, description: string) {
    const date = new Date();
    const dateCreat = `${date.getUTCDay()}\/${date.getUTCMonth()}\/${date.getUTCFullYear()}`;
    const projeto: Projeto = {
      id: this.projetos().length.toString(),
      nome: nome,
      description: description,
      date: dateCreat,
      tarefas: [],
    };
    const nl = [...this.projetos(), projeto];
    this.projetos.set(nl);
    localStorage.setItem('project', JSON.stringify(nl));
  }

  excuirProjeto(id: string) {
    const nl = this.projetos().filter((p) => p.id !== id);
    this.projetos.set(nl);
    localStorage.setItem('project', JSON.stringify(nl));
  }

  addTarefa(nome: string, id: string) {
    const idt = this.projetos()[parseInt(id)].tarefas.length + 1;
    const tarefa: Task = {
      id: idt,
      nome: nome,
      status: 'a fazer',
      ordem: this.projetos()[parseInt(id)].tarefas.length,
    };
    console.log(tarefa);
    const projeto: Projeto = this.projetos()[parseInt(id)];

    const projetoAtualizad: Projeto = {
      ...projeto,
      tarefas: [...projeto.tarefas, tarefa],
    };

    this.atualizarProjeto(projetoAtualizad);
  }

  atualizarProjeto(projeto: Projeto) {
    const atualizados = this.projetos().map((p) =>
      p.id === projeto.id ? projeto : p
    );

    this.projetos.set(atualizados);
    localStorage.setItem('project', JSON.stringify(atualizados));
  }

  editarTarefa(id: number, nome: string, projeto: Projeto) {
    const task = projeto.tarefas.find((p) => p.id == id);
    if (!task) return;

    const taskA: Task = {
      ...task,
      nome: nome,
    };
    const np = projeto.tarefas.map((p) =>
      p.id == taskA.id ? { ...taskA } : { ...p }
    );

    const prrojetoAtualizado: Projeto = {
      ...projeto,
      tarefas: np,
    };
    this.atualizarProjeto(prrojetoAtualizado);
  }

  deleteTask(projeto: Projeto, task: Task) {
    const np = projeto.tarefas.filter((p) => p.id !== task.id);
    const projetoAtualizado: Projeto = {
      ...projeto,
      tarefas: np,
    };

    this.atualizarProjeto(projetoAtualizado);
  }
}
