import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pb } from "@/lib/pocketbase";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeviceItem from "@/components/DeviceItem";

function Facility() {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<any | null>([]);

  async function fetchDevices() {
    const request = await pb
      .collection("devices")
      .getFullList({ requestKey: null, expand: "location" });
    setDevices(request);
    console.log(request);
  }

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
    fetchDevices();
  }, []);
  return (
    <div>
      <Tabs defaultValue='devices' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='devices'>Devices</TabsTrigger>
          <TabsTrigger value='locations'>Locations</TabsTrigger>
        </TabsList>
        <TabsContent value='devices'>
          <Button variant='outline' className='w-full'>
            <Plus className='mr-2' size='1.3em' />
            Add Device
          </Button>
          <div className='flex flex-col gap-2 my-2'>
            {devices[0] &&
              devices.map((device: any) => {
                return (
                  <DeviceItem
                    key={device.id}
                    id={device.id}
                    name={device.name}
                    description={device.description}
                    functional={device.functional}
                    location={device.expand.location}
                    created={device.created}
                  />
                );
              })}
          </div>
        </TabsContent>
        <TabsContent value='locations'>Locations</TabsContent>
      </Tabs>
    </div>
  );
}

export default Facility;
