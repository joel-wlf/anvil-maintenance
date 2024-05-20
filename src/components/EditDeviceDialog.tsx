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
import { useTranslation } from "react-i18next";

interface AddDeviceDialogProps {
  id: string
  name: string;
  description: string;
  location: string;
  functional: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchDevices: () => void;
}

const AddDeviceDialog: FunctionComponent<AddDeviceDialogProps> = ({
  id,
  name,
  description,
  location,
  functional,
  open,
  setOpen,
  fetchDevices,
}) => {
  const { t } = useTranslation(["translation"]);

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
      if (formData.name == "") throw new Error(t("messages.err_enter_name"));
      if (formData.location == "") throw new Error(t("messages.err_select_location"));
      await pb.collection("devices").update(id, formData);
      fetchDevices();
      setLoading(false);
      setOpen(false);
      toast({ title: t("messages.success_updated_device")});
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
          <DialogTitle>{t("facility.edit_device")}</DialogTitle>
          <DialogDescription>{`${t("facility.edit_device_description")} "${name}"`}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2 px-4 pb-5'>
          <Input
            type='text'
            name='name'
            value={formData.name}
            placeholder={t("facility.name_placeholder")}
            onChange={handleChange}
          />
          <Input
            type='description'
            name='description'
            value={formData.description}
            placeholder={t("facility.description_placeholder_optional")}
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
              <SelectValue placeholder={t("facility.location_placeholder")} />
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
            <Label htmlFor='functional'>{t("facility.currently_functional")}</Label>
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t("loading") : t("facility.edit_device")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceDialog;
