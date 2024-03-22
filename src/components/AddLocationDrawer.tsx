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

interface AddLocationDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchLocations: () => void;
}

const AddLocationDrawer: FunctionComponent<AddLocationDrawerProps> = ({
  open,
  setOpen,
  fetchLocations,
}) => {
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
      if (formData.name == "") throw new Error("Please enter a name.");
      if (formData.description == "")
        throw new Error("Please enter a description.");
      await pb.collection("locations").create(formData);
      fetchLocations();
      setLoading(false);
      setOpen(false);
      toast({ title: "Successfully created location." });
    } catch (err: any) {
      setLoading(false);
      toast({ title: err.message, variant: "destructive" });
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Add Location</DrawerTitle>
          <DrawerDescription>Add a location to your facility</DrawerDescription>
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
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Add Location"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddLocationDrawer;
