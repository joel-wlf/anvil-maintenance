import { MenuModeContext } from "@/App";
import AssignSelect from "@/components/AssignSelect";
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
import { RecordModel } from "pocketbase";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Task, Subtask } from "@/types";

function CreateTask() {
  const { t } = useTranslation("translation");

  const navigate = useNavigate();

  const { toast } = useToast();

  const setMenuMode = useContext(MenuModeContext).setMode;

  const [submitLoading, setSubmitLoading] = useState(false);

  const [due, setDue] = useState<Date>();

  const [subtasks, setSubtasks] = useState<Subtask[] | RecordModel[] | null>(
    []
  );

  const [task, setTask] = useState<Task>({
    created_by: pb.authStore.model?.id,
    title: "",
    status: "pending",
    due: null,
    device: "",
    assignees: [],
    subtasks: [],
    notes: "",
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setTask((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }

  async function submit() {
    try {
      setSubmitLoading(true);
      if (task.title == "") throw new Error(t("messages.err_enter_title"));
      if (task.status == "") throw new Error(t("messages.err_select_status"));
      if (task.due == null) throw new Error(t("messages.err_select_due"));
      if (task.device == "") throw new Error(t("messages.err_select_device"));
      await pb.collection("tasks").create(task);
      toast({ title: t("messages.success_created_task") });
      setSubmitLoading(false);
      navigate("/tasks");
    } catch (err: any) {
      setSubmitLoading(false);
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
  }, []);

  return (
    <div className='flex flex-col gap-4 py-5 px-3'>
      <BigInput
        onChange={handleChange}
        name='title'
        value={task.title}
        placeholder={t("create_task.title_placeholder")}
        className='p-0'
      />
      <StatusToggle
        setTask={setTask}
        value={task.status}
        defaultValue='pending'
      />
      <DueSelect due={due} setDue={setDue} />

      <DeviceSelect setTask={setTask} />
      <Separator />
      <AssignSelect task={task} setTask={setTask} />
      <Separator />
      <SubtaskView
        task={task}
        setTask={setTask}
        subtasks={subtasks}
        setSubtasks={setSubtasks}
      />
      <Separator />
      <Textarea
        className='resize-none'
        placeholder={t("create_task.notes_placeholder")}
        name='notes'
        value={task.notes}
        onChange={handleChange}
      />
      <Button className='w-full' onClick={submit} disabled={submitLoading}>
        {submitLoading ? t("loading") : t("create_task.action")}
      </Button>
    </div>
  );
}

export default CreateTask;
