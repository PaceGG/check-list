import { ChecklistItem } from "../types";

const calculateMode = "weighted";

export default function calculateProgress(
  checklist: ChecklistItem,
  checklists: Record<string, ChecklistItem>,
  mode: "weighted" | "equal" = calculateMode
): number {
  if (checklist.children.length === 0) {
    return checklist.completed ? 100 : 0;
  }

  if (mode === "weighted") {
    const totalItems = checklist.children.length;
    const totalProgress = checklist.children.reduce(
      (sum, childId) =>
        sum + calculateProgress(checklists[childId], checklists, "weighted"),
      0
    );
    return totalProgress / totalItems;
  } else {
    let completedCount = 0;
    let totalCount = 0;

    function traverseChildren(item: ChecklistItem) {
      if (item.children.length === 0) {
        totalCount++;
        if (item.completed) completedCount++;
        return;
      }

      for (const childId of item.children) {
        const child = checklists[childId];
        if (!child) continue;
        traverseChildren(child);
      }
    }

    traverseChildren(checklist);
    return totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
  }
}
