import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pb } from "@/lib/pocketbase";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeviceItem from "@/components/DeviceItem";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "react-responsive";
import AddDeviceDrawer from "@/components/AddDeviceDrawer";
import AddDeviceDialog from "@/components/AddDeviceDialog";

function Facility() {
  const navigate = useNavigate();

  const isDesktop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const [devices, setDevices] = useState<any | null>([]);

  const [addDeviceOpen, setAddDeviceOpen] = useState(false);

  async function fetchDevices() {
    const request = await pb
      .collection("devices")
      .getFullList({ requestKey: null, expand: "location" });
    setDevices(request);
  }

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
    fetchDevices();
  }, []);
  return (
    <div className='h-full w-full'>
      <Tabs defaultValue='devices' className='md:hidden w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='devices'>Devices</TabsTrigger>
          <TabsTrigger value='locations'>Locations</TabsTrigger>
        </TabsList>
        <TabsContent value='devices'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => setAddDeviceOpen(true)}
          >
            <Plus className='mr-2' size='1.3em' />
            Add Device
          </Button>
          <div className='flex flex-col gap-2 my-2'>
            {devices[0] ? (
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
                    fetchDevices={fetchDevices}
                  />
                );
              })
            ) : (
              <>
                <div className='flex flex-col m-3 gap-4'>
                  <Skeleton className='h-4 w-[150px]' />
                  <div className='flex items-center gap-2 w-full'>
                    <Skeleton className='h-6 w-[25px]' />
                    <Skeleton className='h-4 w-[200px]' />
                  </div>
                  <Skeleton className='h-4 w-[150px]' />
                  <div className='flex items-center gap-2 w-full'>
                    <Skeleton className='h-6 w-[25px]' />
                    <Skeleton className='h-4 w-[200px]' />
                  </div>
                  <Skeleton className='h-4 w-[150px]' />
                  <div className='flex items-center gap-2 w-full'>
                    <Skeleton className='h-6 w-[25px]' />
                    <Skeleton className='h-4 w-[200px]' />
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value='locations'>Locations</TabsContent>
      </Tabs>
      <div className='hidden md:flex h-full'>
        <ScrollArea className='w-full h-full'>
          <p className='text-2xl md:text-3xl font-semibold pt-2'>Devices</p>
          <div className='grid grid-cols-1 xl:grid-cols-2 w-full gap-2 my-3'>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => setAddDeviceOpen(true)}
            >
              <Plus className='mr-2' size='1.3em' />
              Add Device
            </Button>
            <div className='hidden xl:block grid-item'></div>
            {devices[0] ? (
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
                    fetchDevices={fetchDevices}
                  />
                );
              })
            ) : (
              <>
                <div className='flex flex-col m-3 gap-4'>
                  <Skeleton className='h-4 w-[150px]' />
                  <div className='flex items-center gap-2 w-full'>
                    <Skeleton className='h-6 w-[25px]' />
                    <Skeleton className='h-4 w-[200px]' />
                  </div>
                  <Skeleton className='h-4 w-[150px]' />
                  <div className='flex items-center gap-2 w-full'>
                    <Skeleton className='h-6 w-[25px]' />
                    <Skeleton className='h-4 w-[200px]' />
                  </div>
                  <Skeleton className='h-4 w-[150px]' />
                  <div className='flex items-center gap-2 w-full'>
                    <Skeleton className='h-6 w-[25px]' />
                    <Skeleton className='h-4 w-[200px]' />
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
        <Separator className='mx-5' orientation='vertical' />
        <div className='w-full h-full'>
          <p className='text-2xl md:text-3xl font-semibold pt-2'>Locations</p>
        </div>
      </div>
      {isDesktop ? (
        <AddDeviceDialog
          open={addDeviceOpen}
          setOpen={setAddDeviceOpen}
          fetchDevices={fetchDevices}
        />
      ) : (
        <AddDeviceDrawer
          open={addDeviceOpen}
          setOpen={setAddDeviceOpen}
          fetchDevices={fetchDevices}
        />
      )}
    </div>
  );
}

export default Facility;
