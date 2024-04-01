import { BigInput } from "@/components/ui/big-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { pb } from "@/lib/pocketbase";
import {
  CalendarIcon,
  CheckCircle2,
  Clock,
  Construction,
  Plus,
  Trash2,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// interface User {
//   collectionId: string;
//   collectionName: string;
//   created: string;
//   email: string;
//   emailVisibility: boolean;
//   id: string;
//   name: string;
//   role: string;
//   updated: string;
//   username: string;
//   verified: boolean;
// }

interface Task {
  title: string;
  status: string;
  due: string;
  assignees: string[];
}

function CreateTask() {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<any | null>([]);

  const [users, setUsers] = useState<any | null>([]);

  const [assignSelect, setAssignSelect] = useState("");

  const [assignOpen, setAssignOpen] = useState(false);

  const [due, setDue] = useState<Date>();

  const [task, setTask] = useState<Task>({
    title: "",
    status: "pending",
    due: "",
    assignees: [],
  });

  async function fetchDevices() {
    const request = await pb
      .collection("devices")
      .getFullList({ requestKey: null });
    setDevices(request);
  }

  async function fetchUsers() {
    const request = await pb
      .collection("users")
      .getFullList({ requestKey: null });
    setUsers(request);
  }

  function assignUser() {
    setTask((prevState: any) => {
      return {
        ...prevState,
        assignees: [...prevState.assignees, assignSelect],
      };
    });
    setAssignOpen(false);
  }

  function removeAssignee(idToRemove: string) {
    setTask((prevState: any) => {
      const updatedAssignees = prevState.assignees.filter(
        (id: string) => id !== idToRemove
      );

      return {
        ...prevState,
        assignees: updatedAssignees,
      };
    });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setTask((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }

  useEffect(() => {
    if (due) {
      setTask((prevState: any) => {
        return { ...prevState, due: format(due, "yyyy-MM-dd") };
      });
    }
  }, [due]);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
    fetchDevices();
    fetchUsers();
  }, []);

  return (
    <div className='flex flex-col gap-5 py-5 px-3'>
      <BigInput
        onChange={handleChange}
        name='title'
        value={task.title}
        placeholder='Task Title...'
        className='p-0'
      />
      <ToggleGroup
        onValueChange={(e) =>
          setTask((prevState) => {
            return { ...prevState, status: e };
          })
        }
        type='single'
        value={task.status}
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              "w-full justify-start text-left font-normal",
              !due && "text-muted-foreground"
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {due ? format(due, "yyyy-MM-dd") : <span>Due</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={due}
            onSelect={setDue}
            className='rounded-md border'
          />
        </PopoverContent>
      </Popover>
      <Select
        onValueChange={(e) =>
          setTask((prevState) => {
            return { ...prevState, device: e };
          })
        }
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select Device' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Currently Functional</SelectLabel>
            {devices.map(
              (device: any) =>
                device.functional && (
                  <SelectItem key={device.id} value={device.id}>
                    <div className='flex'>{device.name}</div>
                  </SelectItem>
                )
            )}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Not Functional</SelectLabel>
            {devices.map(
              (device: any) =>
                !device.functional && (
                  <SelectItem key={device.id} value={device.id}>
                    <div className='flex'>{device.name}</div>
                  </SelectItem>
                )
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className='flex gap-2 flex-wrap'>
        {task.assignees.map((assignee: any) => {
          const userObj = users.find((user: any) => user.id === assignee);

          return (
            <Badge
              variant='outline'
              key={assignee}
              className='py-1 px-2'
              onClick={() => removeAssignee(assignee)}
            >
              <Trash2 size='1em' className='mr-1' />
              {userObj.name}
            </Badge>
          );
        })}
        <Popover open={assignOpen} onOpenChange={setAssignOpen}>
          <PopoverTrigger>
            {users.some(
              (user: any) =>
                !task.assignees.some((assignee: any) => assignee === user.id)
            ) ? (
              <Badge variant='outline' className='cursor-pointer py-1 px-2'>
                <Plus size='1em' className='mr-1' />
                Assign User
              </Badge>
            ) : null}
          </PopoverTrigger>
          <PopoverContent className='flex flex-col gap-2'>
            <Select onValueChange={(e: any) => setAssignSelect(e.id)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select User' />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter(
                    (user: any) =>
                      !task.assignees.some(
                        (assignee: any) => assignee === user.id
                      )
                  )
                  .map((user: any) => (
                    <SelectItem key={user.id} value={user}>
                      {user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button className='w-full' onClick={assignUser}>
              Assign
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <Button
        variant='outline'
        className='w-full'
        onClick={() => pb.collection("tasks").create(task)}
      >
        Create Task
      </Button>
    </div>
  );
}

export default CreateTask;
