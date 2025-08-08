export default interface Task {
  id: number;
  nome: string;
  status: 'a fazer' | 'em processo' | 'concluido';
  ordem: number;
}
