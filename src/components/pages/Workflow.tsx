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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { addDays } from "date-fns";

function Workflow() {
  const { taskId } = useParams();

  const { toast } = useToast();

  const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);

  const [imageURL, setImageURL] = useState(null);

  const [rescheduled, setRescheduled] = useState(false);

  const [amount, setAmount] = useState<any>();

  const [amountType, setAmountType] = useState("months")

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
    setSubtasks(request.expand?.subtasks || []);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setRescheduled(false)
    setAmount(e.target.value)
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

  function saveSig() {
    setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
  }

  async function generatePdf() {
    saveSig();
  }

  async function reschedule() {
    setRescheduled(true)
    const newDate = () => {
        if (amountType == "days") {
            return addDays(new Date(), 10)
        }
    }
    alert(newDate())
    const newTask = {...task, id: "", created_by: pb.authStore.model?.id}
    toast({ title: "Successfully rescheduled task." });
  }

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }

    fetchTask();
  }, []);

  return (
    <div className='h-[80vh] w-full'>
      <p className='text-2xl md:text-3xl font-semibold md:pt-2'>{task.title}</p>
      <div className='flex gap-2 w-5/6 h-auto'>
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
        <Card className='flex flex-col gap-2 items-center justify-center w-2/5 h-1/1'>
          {icon()}
          {status()}
        </Card>
      </div>
      <Card>
        {subtasks &&
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
          })}
      </Card>
      <Card>
        <Input type='number' placeholder='Amount' onChange={handleChange} value={amount}/>
        <Select defaultValue='months' value={amountType} onValueChange={(e) => setAmountType(e)}>
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
        <Button onClick={reschedule} disabled={rescheduled || !amount}>
          Reschedule
          <Repeat size='1.3em' className='ml-2' />
        </Button>
      </Card>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
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
            penColor='white'
            canvasProps={{
              className:
                "border-[1px] border-[#333] rounded-lg w-full h-[20vh]",
            }}
          />
          <DialogFooter>
            <Button className='w-full' onClick={generatePdf}>
              Generate Report + Mark as Done
              <Download size='1.3em' className='ml-2' />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Workflow;
