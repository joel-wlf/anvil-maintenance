import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CheckCircle2, Clock, Construction } from "lucide-react";
import { FunctionComponent } from "react";

interface StatusToggleProps {
  setTask: (e: any) => void;
  value: string;
  defaultValue: string;
  disabled?: boolean;
}

const StatusToggle: FunctionComponent<StatusToggleProps> = ({
  setTask,
  value,
  defaultValue,
  disabled
}) => {
  return (
    <ToggleGroup
      onValueChange={(e) =>
        setTask((prevState: any) => {
          return { ...prevState, status: e };
        })
      }
      type='single'
      value={value}
      defaultValue={defaultValue}
      disabled={disabled || false}
    >
      <ToggleGroupItem
        value='pending'
        className='flex flex-col p-2 h-fit w-full gap-1 data-[state=on]:bg-zinc-800'
      >
        <Clock />
        pending
      </ToggleGroupItem>
      <ToggleGroupItem
        value='progress'
        className='flex flex-col p-2 h-fit w-full gap-1 data-[state=on]:bg-amber-800'
      >
        <Construction />
        in progress
      </ToggleGroupItem>
      <ToggleGroupItem
        value='done'
        className='flex flex-col p-2 h-fit w-full gap-1 data-[state=on]:bg-emerald-800'
      >
        <CheckCircle2 />
        done
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default StatusToggle;
