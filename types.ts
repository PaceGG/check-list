export type ChecklistItem = {
  id: string;
  parent: string | null;
  children: string[];
  title: string;
  completed: boolean;
  progressColor: string;
};
