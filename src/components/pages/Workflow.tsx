import { Task } from "@/components/pages/CreateTask";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { pb } from "@/lib/pocketbase";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Construction,
  MapPin,
  Plug,
} from "lucide-react";
import { RecordModel } from "pocketbase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Subtask from "@/components/Subtask";

function Workflow() {
  const { taskId } = useParams();

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [subtasks, setSubtasks] = useState<any | null>(
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
    const request = await pb.collection("tasks").getOne(taskId!, {
      expand: "subtasks,location,device.location",
      requestKey: null,
    });
    setTask(request);
    setSubtasks(request.expand?.subtasks || []);
  }

  const icon = () => {
    if (task.status == "pending") {
      return <Clock size='1.3em' />;
    } else if (task.status == "progress") {
      return <Construction size='1.3em' />;
    } else if (task.status == "done") {
      return <CheckCircle2 size='1.3em' />;
    }
  };

  const status = () => {
    if (task.status == "pending") {
      return "pending";
    } else if (task.status == "progress") {
      return "in progress";
    } else if (task.status == "done") {
      return "done";
    }
  };

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }

    fetchTask();
  }, []);

  return (
    <div className='h-[80vh] w-full'>
      <p className='text-2xl md:text-3xl font-semibold md:pt-2'>{task.title}</p>
      {step == 1 && (
        <div className='flex gap-2 w-5/6 h-auto'>
          <Card className='flex flex-col p-3 w-3/5 h-full'>
            <p className='flex'>
              <Plug className='mr-1' size='1.3em' />
              {task.expand?.device.name}
            </p>
            <p className='flex'>
              <MapPin className='mr-1' size='1.3em' />
              {task.expand?.device.expand.location.name}
            </p>
            <p className='flex'>
              <Clock className='mr-1' size='1.3em' />
              {task.due.split(" ")[0]}
            </p>
          </Card>
          <Card className='flex flex-col gap-2 items-center justify-center w-2/5 h-1/1'>
            {icon()}
            {status()}
          </Card>
        </div>
      )}
      {step == 2 && (
        <div>
          {subtasks &&
            subtasks!.map((subtask: any) => {
              return (
                <Subtask
                  key={subtask.id}
                  id={subtask.id}
                  name={subtask.name}
                  done={subtask.done}
                  setTask={setTask}
                  setSubtasks={setSubtasks}
                  deleteDisabled
                />
              );
            })}
        </div>
      )}
      <div className='flex w-full justify-between pt-3'>
        <Button
          disabled={step == 1}
          variant='ghost'
          onClick={() => setStep((prevState) => (prevState -= 1))}
        >
          Back
        </Button>
        <Button onClick={() => setStep((prevState) => (prevState += 1))}>
          Next Step
          <ArrowRight size='1.3em' className='ml-1' />
        </Button>
      </div>
    </div>
  );
}

export default Workflow;
