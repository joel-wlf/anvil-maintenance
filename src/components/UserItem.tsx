import { FunctionComponent } from "react";
import { Card } from "@/components/ui/card";
import { User, ShieldHalf, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface UserItemProps {
  id: number;
  name: string;
  role: string;
  email: string;
}

const UserItem: FunctionComponent<UserItemProps> = ({
//   id,
  name,
  role,
  email,
}) => {
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
        <Button variant='destructive' className='w-full'>
          Delete
        </Button>{" "}
        <Button variant='outline' className='w-full'>
          Edit
        </Button>
      </div>
    </Card>
  );
};

export default UserItem;
