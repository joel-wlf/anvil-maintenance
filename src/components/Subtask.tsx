import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { ChangeEvent, FormEvent, FunctionComponent } from "react";
import { pb } from "@/lib/pocketbase";

interface SubtaskProps {
  id: string;
  name: string;
  done?: boolean;
  disabled?: boolean;
  deleteDisabled?: boolean;
  setSubtasks: (subtasks: any | null) => void;
  setTask: (subtasks: any | null) => void;
}

const Subtask: FunctionComponent<SubtaskProps> = ({
  id,
  name,
  done,
  disabled,
  deleteDisabled,
  setSubtasks,
  setTask,
}) => {
  async function updateSubtask(e: any) {
    setSubtasks((prevState: any) => {
      return prevState.map((subtask: any) => {
        if (subtask.id === id) {
          return { ...subtask, done: e };
        }
        return subtask;
      });
    });
    await pb.collection("subtasks").update(id, { done: e });
  }

  async function deleteSubtask() {
    setSubtasks((prevState: any) => {
      const updatedSubtasks = prevState.filter(
        (subtask: any) => subtask.id !== idToDelete
      );
      return updatedSubtasks;
    });
    setTask((prevState: any) => {
      const updatedSubtasks = prevState.subtasks.filter(
        (subtask: any) => subtask !== idToDelete
      );
      return { ...prevState, subtasks: updatedSubtasks };
    });
    const idToDelete = id;
    await pb.collection("subtasks").delete(id);
  }

  return (
    <div className='flex items-center gap-2 w-full p-2'>
      <Checkbox
        id='subtask'
        disabled={disabled}
        onCheckedChange={updateSubtask}
        checked={done}
      />
      <label
        htmlFor='subtask'
        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        {name}
      </label>
      {!deleteDisabled && (
        <Trash2
          size='1.1em'
          color='#adadad'
          className='ml-auto'
          onClick={deleteSubtask}
        />
      )}
    </div>
  );
};

export default Subtask;
