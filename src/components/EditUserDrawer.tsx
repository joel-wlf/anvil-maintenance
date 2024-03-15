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
import { ChangeEvent, FunctionComponent, useState } from "react";
import { pb } from "@/lib/pocketbase";

interface EditUserDrawerProps {
  id: string;
  email: string;
  name: string;
  role: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchUsers: () => void;
}

const EditUserDrawer: FunctionComponent<EditUserDrawerProps> = ({
  id,
  email,
  name,
  role,
  open,
  setOpen,
  fetchUsers,
}) => {
  const [formData, setFormData] = useState({
    name: name,
    email: email,
    role: role,
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      if (formData.name == "") throw "Please enter a name"
      if (formData.email == "") throw "Please enter an email address"
      if (formData.role == "") throw "Please select a role"
      await pb.collection("users").update(id, formData);
      fetchUsers();
      setLoading(false);
      setOpen(false);
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Edit User</DrawerTitle>
          <DrawerDescription>Edit user {email}.</DrawerDescription>
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
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Edit User"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditUserDrawer;
