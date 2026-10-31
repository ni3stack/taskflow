import type { TaskPreviewItem } from "../features/marketing/components/TaskPreview";

export const taskPreviewData:TaskPreviewItem[] = [
  {
    id: "preview-1",
    title: "Finish landing page copy",
    status: "in_progress",
    priority: "high",
    dueDateLabel: "Today, 10:00 AM",
  },
  {
    id: "preview-2",
    title: "Review design system tokens",
    status: "todo",
    priority: "medium",
    dueDateLabel: "Today, 1:30 PM",
  },
  {
    id: "preview-3",
    title: "Plan next week’s tasks",
    status: "todo",
    priority: "low",
    dueDateLabel: "Tomorrow",
  },
  {
    id: "preview-4",
    title: "Outline project ideas",
    status: "completed",
    priority: "low",
    dueDateLabel: "Today, 9:00 AM",
  },
];