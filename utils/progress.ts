import { ChecklistItem } from "../types";

export default function calculateProgress(checklist: ChecklistItem): number {
  if (checklist.children.length === 0) {
    return checklist.completed ? 100 : 0;
  }

  const totalItems = checklist.children.length;
  const totalProgress = checklist.children.reduce(
    (sum, child) => sum + calculateProgress(child),
    0
  );

  return totalProgress / totalItems;
}
