import Subtask from "@/components/Subtask";
import { Task } from "@/components/pages/CreateTask";
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

function Workflow() {
  const { taskId } = useParams();

  const { toast } = useToast();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [imageURL, setImageURL] = useState(null);

  const [rescheduled, setRescheduled] = useState(false);

  const [amount, setAmount] = useState<any>();

  const [amountType, setAmountType] = useState("months");

  const sigCanvas = useRef<any>({});

  const [subtasks, setSubtasks] = useState<any | null>([]);

  const [task, setTask] = useState<Task | RecordModel>({
    created_by: "",
    title: "",
    status: "",
    due: "",
    device: "",
    assignees: [],
    subtasks: [],
    notes: "",
  });

  async function fetchTask() {
    const request = await pb.collection("tasks").getOne(taskId!, {
      expand: "subtasks,location,device.location",
      requestKey: null,
    });
    setTask(request);
    setLoading(false);
    setSubtasks(request.expand?.subtasks || []);
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
      return "pending";
    } else if (task.status == "progress") {
      return "in progress";
    } else if (task.status == "done") {
      return "done";
    }
  };

  const Subtasks = () => {
    if (subtasks.length != 0) {
      return (
      subtasks!.map((subtask: any) => {
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
      }))
    } else {
      return <div className='text-center text-[#adadad]'>No subtasks here.</div>
    }
  }

  function saveSig() {
    setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
  }

  async function generatePdf() {
    saveSig();
    console.log(imageURL);
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
      toast({ title: "Successfully rescheduled task." });
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
            <p className='font-semibold text-lg px-2'>Subtasks</p>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
          </Card>
        ) : (
          <Card className='p-2'>
            <p className='font-semibold text-lg px-2'>Subtasks</p>
            <Subtasks />
          </Card>
        )}
        <Card className='flex flex-col gap-2 p-2'>
          <p className='font-semibold text-lg px-2'>Reschedule</p>
          <div className='flex gap-2'>
            <Input
              type='number'
              placeholder='Amount'
              onChange={handleAmountChange}
            />
            <Select
              defaultValue='months'
              value={amountType}
              onValueChange={(e) => setAmountType(e)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Months' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='days'>Days</SelectItem>
                <SelectItem value='weeks'>Weeks</SelectItem>
                <SelectItem value='months'>Months</SelectItem>
                <SelectItem value='years'>Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={reschedule}
            variant='outline'
            disabled={rescheduled || !amount || loading}
          >
            Reschedule Task
            <Repeat size='1.3em' className='ml-2' />
          </Button>
        </Card>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={loading}>
              Document + Save
              <FileBadge size='1.3em' className='ml-2' />
            </Button>
          </DialogTrigger>
          <DialogContent className='w-[95%] rounded-lg'>
            <DialogHeader className='items-start'>
              <DialogTitle>Sign here</DialogTitle>
              <DialogDescription>
                Sign the document to confirm your work.
              </DialogDescription>
            </DialogHeader>
            <SignaturePad
              ref={sigCanvas}
              penColor='black'
              backgroundColor="white"
              canvasProps={{
                className:
                  "border-[1px] border-[#333] rounded-lg w-full h-[20vh]",
              }}
            />
            <img src={imageURL!} alt="" />
            <DialogFooter>
              <Button className='w-full' onClick={generatePdf}>
                Generate Report + Mark as Done
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