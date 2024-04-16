import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Layers, User } from "lucide-react";
import { FunctionComponent } from "react";
import { Task } from "@/components/pages/Tasks";
import TaskRow from "@/components/TaskRow";
import { Separator } from "@/components/ui/separator";

interface TaskViewCardProps {
  type: "due" | "assigned" | "all" | "done";
  collapsed?: boolean;
  noData?: boolean;
  data?: any[];
}

const TaskViewCard: FunctionComponent<TaskViewCardProps> = ({
  type,
  noData,
  data,
}) => {
  const title = () => {
    if (type == "due") {
      return "Due Tasks";
    } else if (type == "assigned") {
      return "Assigned Tasks";
    } else if (type == "all") {
      return "All Tasks";
    } else if (type == "done") {
      return "Done Tasks";
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
            No tasks are in this category.
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
      <div className='flex items-center gap-3 w-full text-lg font-semibold'>
        {icon()}
        {title()}
      </div>
      {tasks()}
    </Card>
  );
};

export default TaskViewCard;
