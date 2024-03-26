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

interface EditLocationDrawerProps {
  id: string
  name: string
  description: string
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
      if (formData.name == "") throw new Error("Please enter a name.");
      await pb.collection("locations").update(id, formData);
      fetchLocations();
      setLoading(false);
      setOpen(false);
      toast({ title: "Successfully updated location." });
    } catch (err: any) {
      setLoading(false);
      toast({ title: err.message, variant: "destructive" });
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Edit Location</DrawerTitle>
          <DrawerDescription>Edit location "{name}"</DrawerDescription>
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
            placeholder='Description (optional)'
            onChange={handleChange}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Edit Location"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditLocationDrawer;
