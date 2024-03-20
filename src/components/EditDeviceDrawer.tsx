import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { pb } from "@/lib/pocketbase";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AddDeviceDrawerProps {
  id: string
  name: string;
  description: string;
  location: string;
  functional: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchDevices: () => void;
}

const AddDeviceDrawer: FunctionComponent<AddDeviceDrawerProps> = ({
  id,
  name,
  description,
  location,
  functional,
  open,
  setOpen,
  fetchDevices,
}) => {
  const [formData, setFormData] = useState({
    name: name,
    description: description,
    location: location,
    functional: functional,
  });

  const [loading, setLoading] = useState(false);

  const [locations, setLocations] = useState<any | null>([]);

  const { toast } = useToast();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      if (formData.name == "") throw new Error("Please enter a name.");
      if (formData.description == "")
        throw new Error("Please enter a description.");
      if (formData.location == "") throw new Error("Please select a location.");
      await pb.collection("devices").update(id, formData);
      fetchDevices();
      setLoading(false);
      setOpen(false);
      toast({ title: "Successfully updated device." });
    } catch (err: any) {
      setLoading(false);
      toast({ title: err.message, variant: "destructive" });
    }
  }

  useEffect(() => {
    async function fetchLocations() {
      const request = await pb
        .collection("locations")
        .getFullList({ requestKey: null });
      setLocations(request);
    }
    fetchLocations();
  }, []);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Edit Device</DrawerTitle>
          <DrawerDescription>Edit a device to your facility.</DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-col gap-2 px-4 pb-5'>
          <Input
            type='text'
            name='name'
            value={formData.name}
            placeholder='Name'
            onChange={handleChange}
          />
          <Input
            type='description'
            name='description'
            value={formData.description}
            placeholder='Description'
            onChange={handleChange}
          />
          <Select
            onValueChange={(e) =>
              setFormData((prevState) => {
                return { ...prevState, location: e };
              })
            }
            value={formData.location}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Location' />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location: any) => (
                <SelectItem value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className='flex items-center space-x-2 mb-2'>
            <Switch
              id='functional'
              checked={formData.functional}
              defaultChecked={true}
              onCheckedChange={(e) =>
                setFormData((prevState) => {
                  return { ...prevState, functional: e };
                })
              }
            />
            <Label htmlFor='functional'>Currently Functional</Label>
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Edit Device"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddDeviceDrawer;
