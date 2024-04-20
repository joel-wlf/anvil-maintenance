import Subtask from "@/components/Subtask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";
import { FunctionComponent, useState } from "react";
import {iSubtask, Task} from "@/components/pages/CreateTask";
import { RecordModel } from "pocketbase";
import { pb } from "@/lib/pocketbase";

interface SubtaskViewProps {
  task: Task;
  setTask: (cb: (value: Task) => Task) => void;
}

const SubtaskView: FunctionComponent<SubtaskViewProps> = ({task, setTask}) => {
  const [subtasks, setSubtasks] = useState<iSubtask[] | RecordModel[] | null>(
    []
  );

  const [subTasksLoading, setSubtasksLoading] = useState(false);

  const [subtaskInput, setSubtaskInput] = useState("");

    async function addSubtask() {
      setSubtaskInput("");
      setSubtasksLoading(true);
      const request = await pb
        .collection("subtasks")
        .create({ name: subtaskInput });
      setTask((prevState) => {
        return { ...prevState, subtasks: [...prevState.subtasks, request.id] };
      });
      setSubtasks((prevState: any) => {
        return [...prevState, request];
      });
      setSubtasksLoading(false);
    }

  return (
    <div>
      {subtasks!.map((subtask: any) => {
        return (
          <Subtask
            key={subtask.id}
            id={subtask.id}
            name={subtask.name}
            disabled
            setTask={setTask}
            setSubtasks={setSubtasks}
          />
        );
      })}
      <div className='flex gap-2 my-2'>
        <Input
          placeholder='Add Subtask...'
          name='subtask'
          value={subtaskInput}
          onChange={(e: any) => setSubtaskInput(e.target.value)}
        />
        <Button
          className='p-2'
          onClick={addSubtask}
          disabled={!subtaskInput || subTasksLoading}
        >
          <ArrowUp size='1.3em' />
        </Button>
      </div>
    </div>
  );
};

export default SubtaskView;
