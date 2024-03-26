import { BigInput } from "@/components/ui/big-input";
import { Clock, Construction, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CreateTask() {
  const [formData, setFormData] = useState({
    title: "",
    status: "",
    priority: "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }

  return (
    <div className='flex flex-col gap-5 py-5 px-3'>
      <BigInput
        onChange={handleChange}
        name='title'
        value={formData.title}
        placeholder='Task Title...'
        className='p-0'
      />
      <ToggleGroup
        onValueChange={(e) =>
          setFormData((prevState) => {
            return { ...prevState, status: e };
          })
        }
        type='single'
        defaultValue='pending'
      >
        <ToggleGroupItem
          value='pending'
          className='flex flex-col p-2 h-fit w-full gap-1 data-[state=on]:bg-zinc-800'
        >
          <Clock />
          pending
        </ToggleGroupItem>
        <ToggleGroupItem
          value='work'
          className='flex flex-col p-2 h-fit w-full gap-1 data-[state=on]:bg-amber-800'
        >
          <Construction />
          in progress
        </ToggleGroupItem>
        <ToggleGroupItem
          value='done'
          className='flex flex-col p-2 h-fit w-full gap-1 data-[state=on]:bg-emerald-800'
        >
          <CheckCircle />
          done
        </ToggleGroupItem>
      </ToggleGroup>
      <Select
        onValueChange={(e) =>
          setFormData((prevState) => {
            return { ...prevState, priority: e };
          })
        }
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Priority' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value='low'>Low</SelectItem>
            <SelectItem value='medium'>Medium</SelectItem>
            <SelectItem value='high'>Hign</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button variant='outline' className='w-full'>
        Create Task
      </Button>
    </div>
  );
}

export default CreateTask;
