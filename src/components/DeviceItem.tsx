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
import { pb } from "@/lib/pocketbase";
import { useMediaQuery } from "react-responsive";
import EditDeviceDrawer from "@/components/EditDeviceDrawer";
import EditDeviceDialog from "@/components/EditDeviceDialog";

interface DeviceItemProps {
  id: string;
  name: string;
  description: string;
  functional: boolean;
  location: any;
  created: string;
  fetchDevices: () => void;
}

const DeviceItem: FunctionComponent<DeviceItemProps> = ({
  id,
  name,
  description,
  functional,
  location,
  created,
  fetchDevices,
}) => {
  const [collapsed, setCollapsed] = useState(true);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editDeviceOpen, setEditDeviceOpen] = useState(false);

  const isDesktop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  async function deleteDevice(id: string) {
    setDeleteLoading(true);
    await pb.collection("devices").delete(id);
    fetchDevices();
  }

  return (
    <Card className='p-3'>
      <div
        className='flex items-center justify-between w-full cursor-pointer'
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
            <Button
              variant='destructive'
              disabled={deleteLoading}
              className='w-full'
              onClick={() => deleteDevice(id)}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
            <Button
              variant='outline'
              disabled={deleteLoading}
              className='w-full'
              onClick={() => setEditDeviceOpen(true)}
            >
              Edit
            </Button>
          </div>
        </>
      )}
      {isDesktop ? (
        <EditDeviceDialog
          key={id}
          id={id}
          name={name}
          description={description}
          location={location.id}
          functional={functional}
          open={editDeviceOpen}
          setOpen={setEditDeviceOpen}
          fetchDevices={fetchDevices}
        />
      ) : (
        <EditDeviceDrawer
          key={id}
          id={id}
          name={name}
          description={description}
          location={location.id}
          functional={functional}
          open={editDeviceOpen}
          setOpen={setEditDeviceOpen}
          fetchDevices={fetchDevices}
        />
      )}
    </Card>
  );
};

export default DeviceItem;
