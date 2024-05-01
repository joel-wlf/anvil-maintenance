import { pb } from "@/lib/pocketbase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { differenceInDays } from "date-fns";
import TaskViewCard from "@/components/TaskViewCard";
import { RecordModel } from "pocketbase";

export interface Task {
  id: string;
  title: string;
  status: "pending" | "progress" | "done";
  created_by: string;
  assignees: string[];
  device: string;
  due: string;
  subtasks: string[];
}

function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[] | RecordModel[]>();

  const currentDate = new Date();

  const dueTasks = tasks?.filter((task: any) => {
    if (
      differenceInDays(task.due, currentDate) <= 7 
    ) {
      return task;
    }
  });

  const assignedTasks = tasks?.filter((task: any) => {
    if (task.assignees.includes(pb.authStore.model?.id)) {
      return task;
    }
  });

  const allTasks = tasks?.filter((task: any) => {
    if (task.status != "done") {
      return task;
    }
  });

  const doneTasks = tasks?.filter((task: any) => {
    if (task.status == "done") {
      return task;
    }
  });

  async function fetchTasks() {
    const request = await pb.collection("tasks").getFullList({
      sort: "due",
      requestKey: null,
      expand: "device,device.location",
    });
    setTasks(request);
  }

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
    fetchTasks();
  }, []);
  return (
    <div>
      <p className='text-2xl md:text-3xl font-semibold md:pt-2'>Tasks</p>
      <Button
        variant='outline'
        className='my-3 w-full'
        onClick={() => navigate("/tasks/createTask")}
      >
        <Plus className='mr-2' size='1.3em' />
        Create Task
      </Button>
      <div className='flex flex-col gap-3'>
        {dueTasks?.length != 0 ? (
          <TaskViewCard type='due' data={dueTasks} />
        ) : (
          <TaskViewCard type='due' noData />
        )}
        {assignedTasks?.length != 0 ? (
          <TaskViewCard type='assigned' data={assignedTasks} />
        ) : (
          <TaskViewCard type='assigned' noData />
        )}
        {allTasks?.length != 0 ? (
          <TaskViewCard type='all' data={allTasks} collapsible />
        ) : (
          <TaskViewCard type='all' noData collapsible />
        )}
        {doneTasks?.length != 0 ? (
          <TaskViewCard type='done' data={doneTasks} collapsible />
        ) : (
          <TaskViewCard type='done' noData collapsible />
        )}
      </div>
    </div>
  );
}

export default Tasks;
