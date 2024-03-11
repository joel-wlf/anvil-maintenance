import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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

interface CreateUserDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateUserDrawer: FunctionComponent<CreateUserDrawerProps> = ({
  open,
  setOpen,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    passwordConfirm: "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Create User</DrawerTitle>
          <DrawerDescription>
            Create a new user for your organisation.
          </DrawerDescription>
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
          <Button>Create User</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateUserDrawer;
