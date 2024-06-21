import { MenuModeContext } from "@/App";
import AssignSelect from "@/components/AssignSelect";
import DeviceSelect from "@/components/DeviceSelect";
import DueSelect from "@/components/DueSelect";
import StatusToggle from "@/components/StatusToggle";
import SubtaskView from "@/components/SubtaskView";
import { Subtask, Task } from "@/components/pages/CreateTask";
import { BigInput } from "@/components/ui/big-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { pb } from "@/lib/pocketbase";
import { format } from "date-fns";
import { RecordModel } from "pocketbase";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PencilLine, PlayCircle, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

function ViewTask() {
  const { t } = useTranslation("translation");

  const navigate = useNavigate();

  const { toast } = useToast();

  const { taskId } = useParams();

  const [loading, setLoading] = useState(false);

  const setMenuMode = useContext(MenuModeContext).setMode;

  const [disabled, setDisabled] = useState(true);

  const [mode, setMode] = useState("view");

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

  async function fetchTask() {
    setLoading(true);
    const request = await pb
      .collection("tasks")
      .getOne(taskId!, { expand: "subtasks", requestKey: null });
    setTask(request);
    setDue(request.due);
    setSubtasks(request.expand?.subtasks || []);
    setLoading(false);
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setTask((prevState: any) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }

  async function deleteTask() {
    try {
      await pb.collection("tasks").delete(taskId!);
      toast({ title: t("messages.success_deleted_task") });
      navigate("/tasks");
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  }

  async function submit() {
    try {
      setDisabled(true);
      if (task.title == "") throw new Error(t("messages.err_enter_title"));
      if (task.status == "") throw new Error(t("messages.err_select_status"));
      if (task.due == "") throw new Error(t("messages.err_select_due"));
      if (task.device == "") throw new Error(t("messages.err_select_device"));
      await pb.collection("tasks").update(taskId!, task);
      toast({ title: t("messages.success_updated_task") });
      setMode("view");
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
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
    setMenuMode("task");
    fetchTask();
  }, []);

  return (
    <div className='flex flex-col gap-4 py-5 px-3'>
      <BigInput
        onChange={handleChange}
        name='title'
        value={task.title}
        placeholder={t("view_task.title_placeholder")}
        disabled={disabled}
        className='p-0 disabled:opacity-100'
      />
      {mode == "view" && (
        <div className='flex items-center w-full gap-2'>
          <Button
            variant='outline'
            className='w-full'
            disabled={loading}
            onClick={() => navigate(`/workflow/${task.id}`)}
          >
            <PlayCircle size='1.3em' className='mr-2' />
            {t("view_task.start_workflow")}
          </Button>
          <Button
            variant='outline'
            disabled={loading}
            onClick={() => {
              setDisabled(false);
              setMode("edit");
            }}
          >
            <PencilLine size='1.3em' />
          </Button>
          <Button variant='outline' disabled={loading} onClick={deleteTask}>
            <Trash2 size='1.3em' />
          </Button>
        </div>
      )}
      <StatusToggle
        setTask={setTask}
        value={task.status}
        defaultValue='pending'
        disabled={disabled}
      />
      <DueSelect due={due} setDue={setDue} disabled={disabled} />
      <DeviceSelect setTask={setTask} disabled={disabled} />
      <Separator />
      <AssignSelect
        task={task}
        setTask={setTask}
        disabled={disabled}
        mode={mode}
      />
      <Separator />
      <SubtaskView
        task={task}
        setTask={setTask}
        subtasks={subtasks}
        setSubtasks={setSubtasks}
        disabled={disabled}
        mode={mode}
        changeDisabled={disabled}
      />
      <Separator />
      <Textarea
        className='resize-none disabled:opacity-100'
        placeholder={t("view_task.notes_placeholder")}
        name='notes'
        value={task.notes}
        onChange={handleChange}
        disabled={disabled}
      />
      {mode == "edit" && (
        <Button className='w-full' onClick={submit} disabled={disabled}>
          {disabled ? t("loading") : t("view_task.action")}
        </Button>
      )}
    </div>
  );
}

export default ViewTask;
