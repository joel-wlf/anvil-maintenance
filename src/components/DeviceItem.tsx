import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  ChevronDown,
  ChevronRight,
  Clock,
  Locate,
  MapPin,
} from "lucide-react";
import { FunctionComponent, useState } from "react";

interface DeviceItemProps {
  id: string;
  name: string;
  description: string;
  functional: boolean;
  location: any;
  created: string;
}

const DeviceItem: FunctionComponent<DeviceItemProps> = ({
  name,
  description,
  functional,
  location,
  created,
}) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Card className='p-3'>
      <div
        className='flex items-center justify-between w-full'
        onClick={() => setCollapsed((prevState) => !prevState)}
      >
        <p className='text-[#adadad] max-w-[80%]'>
          <span className='font-medium text-white'>{name}</span> - {description}
        </p>
        {collapsed ? (
          <ChevronRight
            className='transition-all mx-2'
            color='#adadad'
            size={18}
          />
        ) : (
          <ChevronDown
            className='transition-all mx-2'
            color='#adadad'
            size={18}
          />
        )}
      </div>
      <Separator className='my-1 mt-2' />
      <div className='flex text-[#adadad] items-center justify-start w-auto gap-2'>
        <MapPin size='1.3em' />
        <Button className='p-0 text-[#adadad]' variant='link'>
          {location.name}
        </Button>
      </div>
      {!collapsed && (
        <>
          <Separator className='my-1' />
          <div className='flex text-[#adadad] items-center justify-start w-auto gap-2'>
            <Activity size='1.3em' />
            <Button className='p-0 text-[#adadad]' variant='link'>
              {functional ? "Functional" : "Not Functional"}
            </Button>
          </div>
          <Separator className='my-1' />
          <div className='flex text-[#adadad] items-center justify-start w-auto gap-2'>
            <Clock size='1.3em' />
            <Button className='p-0 text-[#adadad]' variant='link'>
              {created.split(" ")[0]}
            </Button>
          </div>
          <Separator className='my-1 mb-2' />
          <Button variant='outline' className='w-full mb-2'>
            <Locate size='1.3em' className='mr-2' />
            Create Task with Device
          </Button>
          <div className='flex gap-2'>
            <Button variant='destructive' className='w-full'>
              {collapsed ? "Deleting..." : "Delete"}
            </Button>
            <Button variant='outline' className='w-full'>
              Edit
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default DeviceItem;
