import { pb } from "@/lib/pocketbase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Subtask, Task } from "@/components/pages/CreateTask";
import { RecordModel } from "pocketbase";

function Workflow() {
  const { taskId } = useParams();

  const navigate = useNavigate();

  const [subtasks, setSubtasks] = useState<Subtask[] | RecordModel[] | null>(
    []
  );

  const [task, setTask] = useState<Task | RecordModel>({
    created_by: "",
    title: "",
    status: "",
    due: "",
    device: "",
    assignees: [],
    subtasks: [],
    notes: "",
  });

  async function fetchTask() {
    const request = await pb
      .collection("tasks")
      .getOne(taskId!, { expand: "subtasks", requestKey: null });
    setTask(request);
    setSubtasks(request.expand?.subtasks || []);
  }

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }

    fetchTask();
  }, []);

  return (
    <div>
        test
    </div>
  )
}

export default Workflow;
