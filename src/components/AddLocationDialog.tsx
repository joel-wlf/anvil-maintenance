import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { pb } from "@/lib/pocketbase";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

interface AddLocationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchLocations: () => void;
}

const AddLocationDialog: FunctionComponent<AddLocationDialogProps> = ({
  open,
  setOpen,
  fetchLocations,
}) => {
  const { t } = useTranslation(['translation'])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

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
      await pb.collection("locations").create(formData);
      fetchLocations();
      setLoading(false);
      setOpen(false);
      toast({ title: t("messages.success_created_location") });
    } catch (err: any) {
      setLoading(false);
      toast({ title: err.message, variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className='text-left'>
          <DialogTitle>{t("facility.add_location")}</DialogTitle>
          <DialogDescription>{t("facility.add_location_description")}</DialogDescription>
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
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t("loading") : t("facility.add_device")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationDialog;
