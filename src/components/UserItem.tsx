import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pb } from "@/lib/pocketbase";
import { Mail, ShieldHalf, User } from "lucide-react";
import { FunctionComponent, useState } from "react";

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

  async function deleteUser(id: string) {
    setDeleteLoading(true);
    await pb.collection("users").delete(id);
    fetchUsers();
    setDeleteLoading(false);
  }
  return (
    <Card className='p-3'>
      <div className='flex gap-2'>
        {role == "admin" ? <ShieldHalf /> : <User />}
        {name}
      </div>
      <Separator className='my-2' />
      <div className='flex justify-between w-full text-[#adadad]'>
        <div className='flex items-center justify-start w-auto gap-2'>
          <Mail size='1.3em' />
          {email}
        </div>
        <Button variant='link'>Reset Password</Button>
      </div>
      <Separator className='my-2' />
      <div className='flex gap-2'>
        <Button
          variant='destructive'
          disabled={deleteLoading}
          className='w-full'
          onClick={() => deleteUser(id)}
        >
          {deleteLoading ? "Loading..." : "Delete"}
        </Button>
        <Button disabled={deleteLoading} variant='outline' className='w-full'>
          Edit
        </Button>
      </div>
    </Card>
  );
};

export default UserItem;
