import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  Checkbox
} from "@ni3stack/ui";

import "./TaskPreview.css"
import { Calendar, ListChecks } from "lucide-react";

export interface TaskPreviewItem {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDateLabel: string;
}

interface TaskPreviewProps {
  tasks: TaskPreviewItem[];
}

const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  completed: "Done"
}

export default function TaskPreview({ tasks }:TaskPreviewProps) {
  return (
    <div className="task-preview">
      <Card className="task-preview__card">
        <CardHeader>
          <h2 className="task-preview__title">Today</h2>
          <p className="task-preview__subtitle">Personal tasks</p>
        </CardHeader>
        <CardContent>
          <ul className="task-preview__list">
            {
              tasks.map((task)=> (
                <li
                  key={task.id}
                  className={`task-preview__item ${
                    task.status === "completed"
                      ? "task-preview__completed"
                      : ""
                  }`}
                >
                  <Checkbox
                    className="task-preview__checkbox"
                    checked={task.status === "completed"} 
                    readOnly 
                    aria-label={`Completed: ${task.title}`}
                  />
                  <div className="task-preview__details">
                    <div className="task-preview__task-title">{task.title}</div>
                    <div className="task-preview__meta">
                      <Calendar size={16} aria-label="" />
                      <span>{task.dueDateLabel}</span>
                      <span aria-hidden="true"> . </span>
                      <span className={`task-preview__status task-preview__status--${task.status}`}>
                        {statusLabels[task.status]}
                      </span>
                    </div>
                  </div>
                  <span className={`task-preview__priority task-preview__priority--${task.priority}`}>
                    {task.priority}
                  </span>
                </li>
              ))
            }
          </ul>
        </CardContent>
        <CardFooter className="task-preview__caption-container">
          <ListChecks size={14} aria-hidden="true" />
          <p className="task-preview__caption">TASKFLOW TASK_LIST PREVIEW</p>
        </CardFooter>
      </Card>
    </div>
  );
}
