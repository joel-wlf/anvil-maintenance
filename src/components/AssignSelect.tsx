import { Task, User } from "@/components/pages/CreateTask";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pb } from "@/lib/pocketbase";
import { Plus, Trash2 } from "lucide-react";
import { RecordModel } from "pocketbase";
import { FunctionComponent, useEffect, useState } from "react";

interface AssignSelectProps {
  task: Task | RecordModel;
  setTask: (cb: (value: Task | RecordModel) => Task) => void;
  disabled?: boolean;
  mode?: string;
}

const AssignSelect: FunctionComponent<AssignSelectProps> = ({
  task,
  setTask,
  disabled,
  mode
}) => {
  const [users, setUsers] = useState<User[] | RecordModel[] | null>([]);

  const [assignSelect, setAssignSelect] = useState("");

  const [assignOpen, setAssignOpen] = useState(false);

  async function fetchUsers() {
    const request = await pb
      .collection("users")
      .getFullList({ requestKey: null });
    setUsers(request);
  }

  function removeAssignee(idToRemove: string) {
    if (!disabled) {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className='flex gap-2 flex-wrap'>
      {mode == "view" && 
        task.assignees.length == 0 && (
          <div className='flex items-center justify-center text-[#adadad] w-full'>
            No Asignees.
          </div>
        )}
      {users &&
        task.assignees.map((assignee: any) => {
          const userObj = users.find((user: any) => user.id === assignee);
          return (
            <Badge
              variant='outline'
              key={assignee}
              className='py-1 px-2'
              onClick={() => removeAssignee(assignee)}
            >
              {!disabled && <Trash2 size='1em' className='mr-1' />}
              {userObj?.name}
            </Badge>
          );
        })}
      {!disabled && (
        <Popover open={assignOpen} onOpenChange={setAssignOpen}>
          <PopoverTrigger>
            {users!.some(
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
                {users!
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
      )}
    </div>
  );
};

export default AssignSelect;
