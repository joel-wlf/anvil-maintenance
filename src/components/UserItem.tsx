import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pb } from "@/lib/pocketbase";
import { Clock, Mail, ShieldHalf, User } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { useMediaQuery } from "react-responsive";
import EditUserDrawer from "@/components/EditUserDrawer";
import EditUserDialog from "@/components/EditUserDialog";
import { useTranslation } from "react-i18next";

interface UserItemProps {
  fetchUsers: () => void;
  id: string;
  name: string;
  role: string;
  email: string;
  created: string;
}

const UserItem: FunctionComponent<UserItemProps> = ({
  fetchUsers,
  id,
  name,
  role,
  email,
  created,
}) => {
  const { t } = useTranslation("translation");

  const isDesktop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editUserOpen, setEditUserOpen] = useState(false);

  async function deleteUser(id: string) {
    setDeleteLoading(true);
    await pb.collection("users").delete(id);
    fetchUsers();
  }

  return (
    <Card className='grid-item p-3'>
      <div className='flex items-center font-medium gap-2'>
        {role == "admin" ? <ShieldHalf size={36} /> : <User size={36} />}
        {name}
      </div>
      <Separator className='my-2' />
      <div className='flex flex-col justify-between w-full text-[#adadad]'>
        <div className='flex items-center justify-start w-auto gap-2'>
          <Mail size='1.3em' />
          {email}
        </div>
        <Separator className='my-2' />
        <div className='flex items-center justify-start w-auto gap-2'>
          <Clock size='1.3em' />
          {created.split(" ")[0]}
        </div>
      </div>
      <Separator className='my-2' />
      <div className='flex gap-2'>
        <Button
          variant='destructive'
          disabled={deleteLoading}
          className='w-full'
          onClick={() => deleteUser(id)}
        >
          {deleteLoading ? t("delete_loading") : t("delete")}
        </Button>
        <Button
          disabled={deleteLoading}
          variant='outline'
          className='w-full'
          onClick={() => setEditUserOpen(true)}
        >
          {t("edit")}
        </Button>
      </div>
      {isDesktop ? (
        <EditUserDialog
          id={id}
          email={email}
          name={name}
          role={role}
          open={editUserOpen}
          setOpen={setEditUserOpen}
          fetchUsers={fetchUsers}
        />
      ) : (
        <EditUserDrawer
          id={id}
          email={email}
          name={name}
          role={role}
          open={editUserOpen}
          setOpen={setEditUserOpen}
          fetchUsers={fetchUsers}
        />
      )}
    </Card>
  );
};

export default UserItem;
