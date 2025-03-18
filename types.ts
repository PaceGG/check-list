export type ChecklistItem = {
  id: string;
  title: string;
  completed: boolean;
  progressColor: string;
  children: ChecklistItem[];
};
