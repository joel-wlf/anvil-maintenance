import { MenuModeContext } from "@/App";
import AssignSelect from "@/components/AssignSelect";
import { Subtask, Task } from "@/components/pages/CreateTask";
import DeviceSelect from "@/components/DeviceSelect";
import DueSelect from "@/components/DueSelect";
import StatusToggle from "@/components/StatusToggle";
import SubtaskView from "@/components/SubtaskView";
import { BigInput } from "@/components/ui/big-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { pb } from "@/lib/pocketbase";
import { format } from "date-fns";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecordModel } from "pocketbase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ViewTask() {
  const navigate = useNavigate();

  const { toast } = useToast();

  const { taskId } = useParams();

  const setMenuMode = useContext(MenuModeContext).setMode;

  const [disabled, setDisabled] = useState(false);

  const [confirmChangeOpen, setConfirmChangeOpen] = useState(false);

  const [due, setDue] = useState<Date>();

  const [subtasks, setSubtasks] = useState<Subtask[] | RecordModel[] | null>(
    []
  );

  const [task, setTask] = useState<Task | RecordModel>({
    created_by: pb.authStore.model?.id,
    title: "",
    status: "pending",
    due: "",
    device: "",
    assignees: [],
    subtasks: [],
    notes: "",
  });

  const [originalTask, setOriginalTask] = useState<Task | RecordModel>();

  async function fetchTask() {
    const request = await pb
      .collection("tasks")
      .getOne(taskId!, { expand: "subtasks", requestKey: null });
    setTask(request);
    setOriginalTask(request);
    setDue(request.due);
    setSubtasks(request.expand?.subtasks);
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setTask((prevState: any) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }

  async function submit() {
    try {
      setDisabled(true);
      if (task.title == "") throw new Error("Please enter a title.");
      if (task.status == "") throw new Error("Please select a status.");
      if (task.due == "") throw new Error("Please select a due date.");
      if (task.device == "") throw new Error("Please select a device date.");
      await pb.collection("tasks").create(task);
      toast({ title: "Successfully created task." });
      setDisabled(false);
      navigate("/tasks");
    } catch (err: any) {
      setDisabled(false);
      toast({ title: err.message, variant: "destructive" });
    }
  }

  useEffect(() => {
    if (due) {
      setTask((prevState: any) => {
        return { ...prevState, due: format(due, "yyyy-MM-dd") };
      });
    }
  }, [due]);

  useEffect(() => {
    setConfirmChangeOpen(true);
  }, [task]);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
    setMenuMode("task");
    fetchTask();
  }, []);

  return (
    <>
      <div className='flex flex-col gap-4 py-5 px-3'>
        <BigInput
          onChange={handleChange}
          name='title'
          value={task.title}
          placeholder='Task Title...'
          disabled={disabled}
          className='p-0'
        />
        <StatusToggle
          setTask={setTask}
          value={task.status}
          defaultValue='pending'
          disabled={disabled}
        />
        <DueSelect due={due} setDue={setDue} disabled={disabled} />
        <DeviceSelect setTask={setTask} disabled={disabled} />
        <Separator />
        <AssignSelect task={task} setTask={setTask} disabled={disabled} />
        <Separator />
        <SubtaskView
          task={task}
          setTask={setTask}
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          disabled={disabled}
        />
        <Separator />
        <Textarea
          className='resize-none'
          placeholder='Notes...'
          name='notes'
          value={task.notes}
          onChange={handleChange}
          disabled={disabled}
        />
        <Button className='w-full' onClick={submit} disabled={disabled}>
          {disabled ? "Loading..." : "Create Task"}
        </Button>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input id='name' value='Pedro Duarte' className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='username' className='text-right'>
                Username
              </Label>
              <Input id='username' value='@peduarte' className='col-span-3' />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ViewTask;
