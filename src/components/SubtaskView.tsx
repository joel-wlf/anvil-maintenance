import Subtask from "@/components/Subtask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { Task } from "@/components/pages/CreateTask";
import { RecordModel } from "pocketbase";
import { pb } from "@/lib/pocketbase";

interface SubtaskViewProps {
  task: Task | RecordModel;
  setTask: (cb: (value: Task | RecordModel) => Task) => void;
  subtasks: any;
  setSubtasks: any;
  disabled?: boolean;
  changeDisabled?: boolean
}

const SubtaskView: FunctionComponent<SubtaskViewProps> = ({
  setTask,
  subtasks,
  setSubtasks,
  disabled,
  changeDisabled
}) => {
  const [subTasksLoading, setSubtasksLoading] = useState(false);

  const [subtaskInput, setSubtaskInput] = useState("");

  async function addSubtask() {
    setSubtaskInput("");
    setSubtasksLoading(true);
    const request = await pb
      .collection("subtasks")
      .create({ name: subtaskInput });
    setTask((prevState: any) => {
      return { ...prevState, subtasks: [...prevState.subtasks, request.id] };
    });
    setSubtasks((prevState: any) => {
      return [...prevState, request];
    });
    setSubtasksLoading(false);
  }

  return (
    <div>
      {subtasks &&
        subtasks!.map((subtask: any) => {
          return (
            <Subtask
              key={subtask.id}
              id={subtask.id}
              name={subtask.name}
              disabled={changeDisabled}
              setTask={setTask}
              setSubtasks={setSubtasks}
              deleteDisabled={disabled}
            />
          );
        })}
      {!disabled && (
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
      )}
    </div>
  );
};

export default SubtaskView;
