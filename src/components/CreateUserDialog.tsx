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
import { ChangeEvent, FunctionComponent, useState } from "react";
import { pb } from "@/lib/pocketbase";
import { useToast } from "@/components/ui/use-toast";

interface CreateUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchUsers: () => void;
}

const CreateUserDialog: FunctionComponent<CreateUserDialogProps> = ({
  open,
  setOpen,
  fetchUsers,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    passwordConfirm: "",
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
      if (formData.email == "")
        throw new Error("Please enter an email address.");
      if (formData.role == "") throw new Error("Please select a role.");
      if (formData.password == "") throw new Error("Please enter a password.");
      if (formData.passwordConfirm == "")
        throw new Error("Please confirm your password.");
      if (formData.password != formData.passwordConfirm)
        throw new Error("The passwords don't match.");
      await pb.collection("users").create(formData);
      fetchUsers();
      setLoading(false);
      setOpen(false);
      toast({ title: "Successfully created user." });
    } catch (err: any) {
      setLoading(false);
      toast({ title: err.message, variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className='text-left'>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create a new user for your organisation.
          </DialogDescription>
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
            type='email'
            name='email'
            value={formData.email}
            placeholder='Email'
            onChange={handleChange}
          />
          <Select
            onValueChange={(e) =>
              setFormData((prevState) => {
                return { ...prevState, role: e };
              })
            }
            value={formData.role}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='user'>User</SelectItem>
              <SelectItem value='admin'>Admin</SelectItem>
            </SelectContent>
          </Select>
          <div className='flex items-center justify-between gap-2'>
            <Input
              type='password'
              name='password'
              value={formData.password}
              placeholder='Password (min. 8)'
              onChange={handleChange}
            />
            <Input
              type='password'
              name='passwordConfirm'
              value={formData.passwordConfirm}
              placeholder='Confirm Password'
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Create User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
