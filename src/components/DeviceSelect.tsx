import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pb } from "@/lib/pocketbase";
import { FunctionComponent, useEffect, useState } from "react";
import { Device, Task } from "@/components/pages/CreateTask";
import { RecordModel } from "pocketbase";

interface DeviceSelectProps {
  setTask: (cb: (value: Task) => Task) => void;
}

const DeviceSelect: FunctionComponent<DeviceSelectProps> = ({ setTask }) => {
  const [devices, setDevices] = useState<Device[] | RecordModel[] | null>([]);

  async function fetchDevices() {
    const request = await pb
      .collection("devices")
      .getFullList({ requestKey: null });
    setDevices(request);
  }

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <Select
      onValueChange={(e) =>
        setTask((prevState: Task) => {
          return { ...prevState, device: e };
        })
      }
    >
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select Device' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Currently Functional</SelectLabel>
          {devices!.map(
            (device: any) =>
              device.functional && (
                <SelectItem key={device.id} value={device.id}>
                  <div className='flex'>{device.name}</div>
                </SelectItem>
              )
          )}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Not Functional</SelectLabel>
          {devices!.map(
            (device: any) =>
              !device.functional && (
                <SelectItem key={device.id} value={device.id}>
                  <div className='flex'>{device.name}</div>
                </SelectItem>
              )
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DeviceSelect;
