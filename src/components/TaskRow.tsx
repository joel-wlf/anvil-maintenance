import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FunctionComponent } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface TaskRowProps {
  data?: any;
  loading?: boolean;
}

const TaskRow: FunctionComponent<TaskRowProps> = ({ data, loading }) => {

  const navigate = useNavigate()

  if (!loading) {
    return (
      <>
        <Separator className='my-2' />
        <div className='flex' onClick={() => navigate(`/tasks/${data.id}`)}>
          <div className='w-5/6'>
            <div className='text-lg'>
              {data.title}
              <span className='text-[#adadad]'>
                {" - " + data.expand.device.name}
              </span>
            </div>
            <div className='flex items-center gap-1 overflow-scroll text-nowrap text-sm text-[#adadad]'>
              <CalendarDays size='1.1em' /> {data.due.split(" ")[0]}
              <p>|</p>
              <MapPin size='1.1em' /> {data.expand.device.expand.location.name}
            </div>
          </div>
          <div className='flex items-center justify-center w-1/6'>
            <ArrowRight size='1.3em' color='#adadad' />
          </div>
        </div>
      </>
    );
  } else if (loading) {
    return (
      <>
        <Separator className='my-2' />
        <div className='flex flex-col gap-1'>
          <Skeleton className='h-4 w-52' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Separator className='my-2' />
        <div className='flex flex-col gap-1'>
          <Skeleton className='h-4 w-52' />
          <Skeleton className='h-4 w-64' />
        </div>
      </>
    );
  }
};

export default TaskRow;
