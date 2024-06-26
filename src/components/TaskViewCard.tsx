import TaskRow from "@/components/TaskRow";
import { Task } from "@/components/pages/Tasks";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Layers,
  User,
} from "lucide-react";
import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

interface TaskViewCardProps {
  type: "due" | "assigned" | "all" | "done";
  collapsible?: boolean;
  noData?: boolean;
  data?: any[];
}

const TaskViewCard: FunctionComponent<TaskViewCardProps> = ({
  type,
  collapsible,
  noData,
  data,
}) => {
    const { t } = useTranslation(["translation"]);

  const [collapsed, setCollapsed] = useState(collapsible);

  const title = () => {
    if (type == "due") {
      return t("tasks.due_tasks");
    } else if (type == "assigned") {
      return t("tasks.assigned_tasks");
    } else if (type == "all") {
      return t("tasks.all_tasks");
    } else if (type == "done") {
      return t("tasks.done_tasks");
    }
  };

  const icon = () => {
    if (type == "due") {
      return <Clock />;
    } else if (type == "assigned") {
      return <User />;
    } else if (type == "all") {
      return <Layers />;
    } else if (type == "done") {
      return <CheckCircle2 />;
    }
  };

  const tasks = () => {
    if (noData) {
      return (
        <>
          <Separator className='my-2' />
          <div className='text-center text-[#adadad]'>
            {t("tasks.no_tasks")}
          </div>
        </>
      );
    }
    if (data) {
      return data.map((task: Task) => {
        return <TaskRow key={task.id} data={task} />;
      });
    }
    if (!data) {
      return <TaskRow loading />;
    }
  };

  return (
    <Card className='p-3'>
      <div
        className='flex items-center gap-3 w-full text-lg font-semibold'
        onClick={() => {
          if (collapsible) {
            setCollapsed((prevState) => !prevState);
          }
        }}
      >
        <div className='flex gap-2 w-5/6'>
          {icon()}
          {title()}
        </div>
        {collapsible && (
          <div className='flex items-center justify-center w-1/6'>
            {collapsed ? (
              <ChevronRight size={18} color='#adadad' />
            ) : (
              <ChevronDown size={18} color='#adadad' />
            )}
          </div>
        )}
      </div>
      {!collapsed && tasks()}
    </Card>
  );
};

export default TaskViewCard;
