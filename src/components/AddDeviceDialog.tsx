import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface AddDeviceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchDevices: () => void;
}

const AddDeviceDialog: FunctionComponent<AddDeviceDialogProps> = ({
  open,
  setOpen,
  fetchDevices,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    functional: true,
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
      if (formData.location == "")
        throw new Error("Please select a location.");
      await pb.collection("devices").create(formData);
      fetchDevices();
      setLoading(false);
      setOpen(false);
      toast({ title: "Successfully created device." });
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className='text-left'>
          <DialogTitle>Add Device</DialogTitle>
          <DialogDescription>Add a device to your facility</DialogDescription>
        </DialogHeader>
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
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
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
            {loading ? "Loading..." : "Add Device"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceDialog;