export interface Task {
  id?: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt?: Date;
  dueDate?: Date;
}

export enum TaskStatus {
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  SUSPENDU = 'SUSPENDU'
}

export interface TaskStatusInfo {
  value: TaskStatus;
  label: string;
  color: string;
  icon: string;
}

export const TASK_STATUS_CONFIG: TaskStatusInfo[] = [
  {
    value: TaskStatus.EN_COURS,
    label: 'En cours',
    color: 'warn',
    icon: 'pending'
  },
  {
    value: TaskStatus.TERMINE,
    label: 'Terminé',
    color: 'primary',
    icon: 'check_circle'
  },
  {
    value: TaskStatus.SUSPENDU,
    label: 'Suspendu',
    color: 'accent',
    icon: 'pause_circle'
  }
];
