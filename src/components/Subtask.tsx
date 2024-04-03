import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { FunctionComponent } from "react";

interface SubtaskProps {
  name: string;
  disabled?: boolean;
}

const Subtask: FunctionComponent<SubtaskProps> = ({ name, disabled }) => {
  return (
    <div className='flex items-center gap-2 w-full p-2'>
      <Checkbox id='subtask' disabled={disabled} />
      <label
        htmlFor='subtask'
        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        {name}
      </label>
      <Trash2
        size='1.1em'
        color='#adadad'
        className='ml-auto mr-2'
        onClick={() => alert("delete subtask")}
      />
    </div>
  );
};

export default Subtask;
