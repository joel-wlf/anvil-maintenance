import Subtask from "@/components/Subtask";
import { Task } from "@/components/pages/CreateTask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pb } from "@/lib/pocketbase";
import { ArrowUp } from "lucide-react";
import { RecordModel } from "pocketbase";
import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

interface SubtaskViewProps {
  task: Task | RecordModel;
  setTask: (cb: (value: Task | RecordModel) => Task) => void;
  subtasks: any;
  setSubtasks: any;
  disabled?: boolean;
  changeDisabled?: boolean;
  mode?: string;
}

const SubtaskView: FunctionComponent<SubtaskViewProps> = ({
  setTask,
  subtasks,
  setSubtasks,
  disabled,
  changeDisabled,
  mode,
}) => {
    const { t } = useTranslation(["translation"]);

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

  function noItems() {
    if (mode == "view" && subtasks.length == 0) {
      return (
        <div className='flex items-center justify-center text-[#adadad] w-full'>
          {t("tasks.no_subtasks")}
        </div>
      );
    }
  }

  return (
    <div>
      {noItems()}
      {subtasks &&
        subtasks!.map((subtask: any) => {
          return (
            <Subtask
              key={subtask.id}
              id={subtask.id}
              name={subtask.name}
              done={subtask.done}
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
            placeholder={t("tasks.subtask_placeholder")}
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
