import Task from './Task';

export default interface Projeto {
  id: string;
  nome: string;
  description: string;
  date: string;
  tarefas: Task[];
}
