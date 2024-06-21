import AddDeviceDialog from "@/components/AddDeviceDialog";
import AddDeviceDrawer from "@/components/AddDeviceDrawer";
import AddLocationDialog from "@/components/AddLocationDialog";
import AddLocationDrawer from "@/components/AddLocationDrawer";
import DeviceItem from "@/components/DeviceItem";
import LocationItem from "@/components/LocationItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pb } from "@/lib/pocketbase";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

function Facility() {
  const { t } = useTranslation("translation");

  const navigate = useNavigate();

  const isDesktop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const [devices, setDevices] = useState<any | null>([]);

  const [locations, setLocations] = useState<any | null>([]);

  const [addDeviceOpen, setAddDeviceOpen] = useState(false);

  const [addLocationOpen, setAddLocationOpen] = useState(false);

  async function fetchDevices() {
    const request = await pb
      .collection("devices")
      .getFullList({ requestKey: null, expand: "location" });
    setDevices(request);
  }

  async function fetchLocations() {
    const request = await pb
      .collection("locations")
      .getFullList({ requestKey: null });
    setLocations(request);
  }

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
    fetchDevices();
    fetchLocations();
  }, []);
  return (
    <div className='h-full w-full'>
      <Tabs defaultValue='devices' className='md:hidden w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='devices'>{t("facility.devices")}</TabsTrigger>
          <TabsTrigger value='locations'>{t("facility.locations")}</TabsTrigger>
        </TabsList>
        <TabsContent value='devices'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => setAddDeviceOpen(true)}
          >
            <Plus className='mr-2' size='1.3em' />
            {t("facility.add_device")}
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
        <TabsContent value='locations'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => setAddLocationOpen(true)}
          >
            <Plus className='mr-2' size='1.3em' />
            {t("facility.add_location")}
          </Button>
          <div className='flex flex-col gap-2 my-2'>
            {locations[0] ? (
              locations.map((location: any) => {
                return (
                  <LocationItem
                    key={location.id}
                    id={location.id}
                    name={location.name}
                    description={location.description}
                    created={location.created}
                    fetchLocations={fetchLocations}
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
      </Tabs>
      <div className='hidden md:flex h-full'>
        <ScrollArea className='w-full h-full'>
          <p className='text-2xl md:text-3xl font-semibold pt-2'>
            {t("facility.devices")}
          </p>
          <div className='grid grid-cols-1 xl:grid-cols-2 w-full gap-2 my-3'>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => setAddDeviceOpen(true)}
            >
              <Plus className='mr-2' size='1.3em' />
              {t("facility.add_device")}
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
        <ScrollArea className='w-full h-full'>
          <p className='text-2xl md:text-3xl font-semibold pt-2'>
            {t("facility.locations")}
          </p>
          <div className='grid grid-cols-1 xl:grid-cols-2 w-full gap-2 my-3'>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => setAddLocationOpen(true)}
            >
              <Plus className='mr-2' size='1.3em' />
              {t("facility.add_location")}
            </Button>
            <div className='hidden xl:block grid-item'></div>
            {locations[0] ? (
              locations.map((location: any) => {
                return (
                  <LocationItem
                    key={location.id}
                    id={location.id}
                    name={location.name}
                    description={location.description}
                    created={location.created}
                    fetchLocations={fetchLocations}
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
      </div>
      {isDesktop ? (
        <>
          <AddDeviceDialog
            open={addDeviceOpen}
            setOpen={setAddDeviceOpen}
            fetchDevices={fetchDevices}
          />
          <AddLocationDialog
            open={addLocationOpen}
            setOpen={setAddLocationOpen}
            fetchLocations={fetchLocations}
          />
        </>
      ) : (
        <>
          <AddDeviceDrawer
            open={addDeviceOpen}
            setOpen={setAddDeviceOpen}
            fetchDevices={fetchDevices}
          />
          <AddLocationDrawer
            open={addLocationOpen}
            setOpen={setAddLocationOpen}
            fetchLocations={fetchLocations}
          />
        </>
      )}
    </div>
  );
}

export default Facility;
