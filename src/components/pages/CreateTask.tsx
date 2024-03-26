import { BigInput } from "@/components/ui/big-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { pb } from "@/lib/pocketbase";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Construction,
  Plus,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormData {
  title: string;
  status: string;
  priority: string;
  assignees: {
    collectionId: string;
    collectionName: string;
    created: string;
    email: string;
    emailVisibility: boolean;
    id: string;
    name: string;
    role: string;
    updated: string;
    username: string;
    verified: boolean;
  }[];
}

function CreateTask() {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<any | null>([]);

  const [users, setUsers] = useState<any | null>([]);

  const [assignSelect, setAssignSelect] = useState({});

  const [assignOpen, setAssignOpen] = useState(false);

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

  const [formData, setFormData] = useState<FormData>({
    title: "",
    status: "",
    priority: "",
    assignees: [],
  });

  function assignUser() {
    if (assignSelect) {
      setFormData((prevState: any) => {
        return {
          ...prevState,
          assignees: [...prevState.assignees, assignSelect],
        };
      });
    }
    setAssignOpen(false);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }

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
          <CheckCircle2 />
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
          <SelectValue placeholder='Select Device' />
        </SelectTrigger>
        <SelectContent>
          {devices.map((device: any) => (
            <SelectItem key={device.id} value={device.id}>
              <div className='flex'>
                {!device.functional && (
                  <AlertTriangle size='1.3em' className='mr-2' />
                )}
                {device.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className='flex gap-2 flex-wrap'>
        {formData.assignees.map((assignee: any) => (
          <Badge variant='outline' key={assignee.id} className='py-1 px-2'>
            {assignee.name}
          </Badge>
        ))}
        <Popover open={assignOpen} onOpenChange={setAssignOpen}>
          <PopoverTrigger>
            {users.some(
              (user: any) =>
                !formData.assignees.some(
                  (assignee: any) => assignee.id === user.id
                )
            ) ? (
              <Badge variant='outline' className='cursor-pointer py-1 px-2'>
                <Plus size='1em' className='mr-1' />
                Assign User
              </Badge>
            ) : null}
          </PopoverTrigger>
          <PopoverContent className='flex flex-col gap-2'>
            <Select onValueChange={(e) => setAssignSelect(e)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select User' />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter(
                    (user: any) =>
                      !formData.assignees.some(
                        (assignee: any) => assignee.id === user.id
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
      <Button variant='outline' className='w-full'>
        Create Task
      </Button>
    </div>
  );
}

export default CreateTask;
