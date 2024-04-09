import { pb } from "@/lib/pocketbase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { differenceInDays } from "date-fns"

function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<any | null>([]);

  const currentDate = new Date()

  const dueTasks = tasks.filter((task: any) => {
    if (differenceInDays(task.due, currentDate) <= 7 && differenceInDays(task.due, currentDate) >= 0) {
      return task;
    }
  })

  const assignedTasks = tasks.filter((task: any) => {
    if (task.assignees.includes(pb.authStore.model?.id)) {
      return task;
    }
  })

  const allTasks = tasks.filter((task: any) => {
    if (task.status != "done") {
      return task;
    }
  })

  const doneTasks = tasks.filter((task: any) => {
    if (task.status == "done") {
      return task;
    }
  })

  async function fetchTasks() {
    const request = await pb.collection("tasks").getFullList({
      sort: "-created",
      requestKey: null,
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
      {JSON.stringify(dueTasks)}
    </div>
  );
}

export default Tasks;
