import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { pb } from "@/lib/pocketbase";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

interface EditLocationDrawerProps {
  id: string;
  name: string;
  description: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchLocations: () => void;
}

const EditLocationDrawer: FunctionComponent<EditLocationDrawerProps> = ({
  id,
  name,
  description,
  open,
  setOpen,
  fetchLocations,
}) => {
  const { t } = useTranslation(["translation"]);

  const [formData, setFormData] = useState({
    name: name,
    description: description,
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
      await pb.collection("locations").update(id, formData);
      fetchLocations();
      setLoading(false);
      setOpen(false);
      toast({ title: t("messages.success_updated_location") });
    } catch (err: any) {
      setLoading(false);
      toast({ title: err.message, variant: "destructive" });
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{t("facility.edit_location")}</DrawerTitle>
          <DrawerDescription>{`${t(
            "facility.edit_location_description"
          )} "${name}"`}</DrawerDescription>
        </DrawerHeader>
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
            {loading ? t("loading") : t("facility.edit_location")}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditLocationDrawer;
