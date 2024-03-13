import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { pb } from "@/lib/pocketbase";
import { Mail, ShieldHalf, User } from "lucide-react";
import { ChangeEvent, FunctionComponent, useState } from "react";

interface UserItemProps {
  fetchUsers: () => void;
  id: string;
  name: string;
  role: string;
  email: string;
}

const UserItem: FunctionComponent<UserItemProps> = ({
  fetchUsers,
  id,
  name,
  role,
  email,
}) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  const [passwordOpen, setPasswordOpen] = useState(false);

  const [passwordFormData, setPasswordFormData] = useState({
    password: "",
    passwordConfirm: "",
  });

  async function deleteUser(id: string) {
    setDeleteLoading(true);
    await pb.collection("users").delete(id);
    fetchUsers();
  }

  async function resetPassword() {
    setPasswordResetLoading(true);
    await pb.collection("users").update(id, passwordFormData);
    setPasswordOpen(false);
    setPasswordResetLoading(false);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setPasswordFormData((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  }

  return (
    <Card className='p-3'>
      <div className='flex items-center font-medium gap-2'>
        {role == "admin" ? <ShieldHalf size={36} /> : <User size={36} />}
        {name}
      </div>
      <Separator className='my-2' />
      <div className='flex justify-between w-full text-[#adadad]'>
        <div className='flex items-center justify-start w-auto gap-2'>
          <Mail size='1.3em' />
          {email}
        </div>
        {/* <Button variant='link' onClick={() => setPasswordOpen(true)}>
          Reset Password
        </Button> */}
      </div>
      <Separator className='my-2' />
      <div className='flex gap-2'>
        <Button
          variant='destructive'
          disabled={deleteLoading}
          className='w-full'
          onClick={() => deleteUser(id)}
        >
          {deleteLoading ? "Deleting..." : "Delete"}
        </Button>
        <Button disabled={deleteLoading} variant='outline' className='w-full'>
          Edit
        </Button>
      </div>
      <Drawer open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DrawerContent>
          <DrawerHeader className='text-left'>
            <DrawerTitle>Reset Password</DrawerTitle>
            <DrawerDescription>Reset password of {email}</DrawerDescription>
          </DrawerHeader>
          <div className='flex flex-col gap-2 px-4 pb-5'>
            <Input
              type='password'
              placeholder='New Password'
              name='password'
              value={passwordFormData.password}
              onChange={handleChange}
            />
            <Input
              type='password'
              placeholder='Confirm New Password'
              name='passwordConfirm'
              value={passwordFormData.passwordConfirm}
              onChange={handleChange}
            />
            <Button disabled={passwordResetLoading} onClick={resetPassword}>
              {passwordResetLoading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </Card>
  );
};

export default UserItem;
