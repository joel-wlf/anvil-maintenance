import Subtask from "@/components/Subtask";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { pb } from "@/lib/pocketbase";
import {
  CheckCircle2,
  Clock,
  Construction,
  Download,
  FileBadge,
  MapPin,
  Plug,
  Repeat,
} from "lucide-react";
import { RecordModel } from "pocketbase";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SignaturePad from "react-signature-canvas";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { makePdf } from "@/lib/pdf";

function Workflow() {
  const { t } = useTranslation("translation");

  const { taskId } = useParams();

  const { toast } = useToast();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);

  const [rescheduled, setRescheduled] = useState(false);

  const [amount, setAmount] = useState<any>();

  const [amountType, setAmountType] = useState("months");

  const sigCanvas = useRef<any>({});

  const [subtasks, setSubtasks] = useState<any | null>([]);

  const [task, setTask] = useState<Task | RecordModel>({
    created_by: "",
    title: "",
    status: "",
    due: new Date(),
    device: "",
    assignees: [],
    subtasks: [],
    notes: "",
  });

  async function fetchTask() {
    try {
      const request = await pb.collection("tasks").getOne(taskId!, {
        expand: "subtasks,device.location,assignees",
        requestKey: null,
      });
      setTask(request);
      setSubtasks(request.expand?.subtasks || []);
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    setRescheduled(false);
    setAmount(e.target.value);
  }

  const icon = () => {
    if (task.status == "pending") {
      return <Clock size='1.3em' />;
    } else if (task.status == "progress") {
      return <Construction size='1.3em' />;
    } else if (task.status == "done") {
      return <CheckCircle2 size='1.3em' />;
    }
  };

  const status = () => {
    if (task.status == "pending") {
      return t("workflow.pending");
    } else if (task.status == "progress") {
      return t("workflow.progress");
    } else if (task.status == "done") {
      return t("workflow.done");
    }
  };

  const Subtasks = () => {
    if (subtasks.length != 0) {
      return subtasks!.map((subtask: any) => {
        return (
          <Subtask
            key={subtask.id}
            id={subtask.id}
            name={subtask.name}
            done={subtask.done}
            setTask={setTask}
            setSubtasks={setSubtasks}
            deleteDisabled
          />
        );
      });
    } else {
      return (
        <div className='text-center text-[#adadad]'>
          {t("messages.no_subtasks")}
        </div>
      );
    }
  };

  async function generatePdf() {
    setGenerating(true);

    const signatureDataUrl = await sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    await makePdf(task, subtasks, signatureDataUrl);

    await pb.collection("tasks").update(task.id!, { status: "done" });

    toast({title: t("messages.download_started")})

    navigate("/tasks");
  }

  async function reschedule() {
    setRescheduled(true);
    const today = new Date();
    const newDate = () => {
      if (amountType == "days") {
        return addDays(today, +amount);
      } else if (amountType == "weeks") {
        return addWeeks(today, +amount);
      } else if (amountType == "months") {
        return addMonths(today, +amount);
      } else if (amountType == "years") {
        return addYears(today, +amount);
      }
    };
    const newTask = {
      ...task,
      id: "",
      created_by: pb.authStore.model?.id,
      due: newDate(),
    };
    try {
      await pb.collection("tasks").create(newTask);
      toast({ title: t("messages.success_rescheduled_task") });
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  }

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
    fetchTask();
  }, []);

  return (
    <div className='h-[80vh] w-full'>
      {loading ? (
        <Skeleton className='h-6 w-40 md:pt-2' />
      ) : (
        <p className='text-2xl md:text-3xl font-semibold md:pt-2'>
          {task.title}
        </p>
      )}
      <div className='flex flex-col w-full gap-5 py-5'>
        <div className='flex gap-5 w-full h-auto'>
          {loading ? (
            <Card className='flex flex-col p-3 w-3/5 gap-1 h-full'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
            </Card>
          ) : (
            <Card className='flex flex-col p-3 w-3/5 h-full'>
              <p className='flex'>
                <Plug className='mr-1' size='1.3em' />
                {task.expand?.device.name}
              </p>
              <p className='flex'>
                <MapPin className='mr-1' size='1.3em' />
                {task.expand?.device.expand.location.name}
              </p>
              <p className='flex'>
                <Clock className='mr-1' size='1.3em' />
                {task.due.split(" ")[0]}
              </p>
            </Card>
          )}
          {loading ? (
            <Card className='flex flex-col gap-2 items-center justify-center w-2/5 h-1/1'>
              <Skeleton className='h-6 w-6' />
              <Skeleton className='h-4 w-16' />
            </Card>
          ) : (
            <Card className='flex flex-col gap-2 items-center justify-center w-2/5 h-1/1'>
              {icon()}
              {status()}
            </Card>
          )}
        </div>
        {loading ? (
          <Card className='flex flex-col gap-1 p-2'>
            <p className='font-semibold text-lg px-2'>
              {t("workflow.subtasks")}
            </p>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
          </Card>
        ) : (
          <Card className='p-2'>
            <p className='font-semibold text-lg px-2'>
              {t("workflow.subtasks")}
            </p>
            <Subtasks />
          </Card>
        )}
        <Card className='flex flex-col gap-2 p-2'>
          <p className='font-semibold text-lg px-2'>
            {t("workflow.reschedule")}
          </p>
          <div className='flex gap-2'>
            <Input
              type='number'
              placeholder={t("workflow.amount_placeholder")}
              onChange={handleAmountChange}
            />
            <Select
              defaultValue='months'
              value={amountType}
              onValueChange={(e) => setAmountType(e)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("workflow.months")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='days'>{t("workflow.days")}</SelectItem>
                <SelectItem value='weeks'>{t("workflow.weeks")}</SelectItem>
                <SelectItem value='months'>{t("workflow.months")}</SelectItem>
                <SelectItem value='years'>{t("workflow.years")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={reschedule}
            variant='outline'
            disabled={rescheduled || !amount || loading || amount <= 0}
          >
            {t("workflow.reschedule_action")}
            <Repeat size='1.3em' className='ml-2' />
          </Button>
        </Card>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={loading}>
              {t("workflow.action")}
              <FileBadge size='1.3em' className='ml-2' />
            </Button>
          </DialogTrigger>
          <DialogContent className='w-[95%] rounded-lg'>
            <DialogHeader className='items-start text-start'>
              <DialogTitle>{t("workflow.sign_here")}</DialogTitle>
              <DialogDescription>
                {t("workflow.sign_description")}
              </DialogDescription>
            </DialogHeader>
            <SignaturePad
              ref={sigCanvas}
              penColor='black'
              backgroundColor='white'
              canvasProps={{
                className:
                  "border-[1px] border-[#333] rounded-lg w-full h-[20vh]",
              }}
            />
            <DialogFooter>
              <Button
                className='w-full'
                onClick={generatePdf}
                disabled={generating}
              >
                {generating ? t("workflow.generating") : t("workflow.action2")}
                <Download size='1.3em' className='ml-2' />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Workflow;
