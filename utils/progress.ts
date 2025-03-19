import { ChecklistItem } from "../types";

export default function calculateProgress(
  checklist: ChecklistItem,
  checklists: Record<string, ChecklistItem>
): number {
  if (checklist.children.length === 0) {
    return checklist.completed ? 100 : 0;
  }

  const totalItems = checklist.children.length;
  const totalProgress = checklist.children.reduce(
    (sum, childId) => sum + calculateProgress(checklists[childId], checklists),
    0
  );

  return totalProgress / totalItems;
}
