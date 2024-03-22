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

interface EditLocationDialogProps {
  id: string;
  name: string;
  description: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchLocations: () => void;
}

const EditLocationDialog: FunctionComponent<EditLocationDialogProps> = ({
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
      if (formData.description == "")
        throw new Error("Please enter a description.");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className='text-left'>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>Edit location "{name}"</DialogDescription>
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
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Edit Location"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLocationDialog;
