import { Button } from "@/components/ui/button";
import CreateUserDrawer from "@/components/CreateUserDrawer";
import { pb } from "@/lib/pocketbase";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserItem from "@/components/UserItem";
import { Skeleton } from "@/components/ui/skeleton";

function Admin() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any | null>([]);

  const [createUserOpen, setCreateUserOpen] = useState(false);

  async function fetchUsers() {
    const request = await pb
      .collection("users")
      .getFullList({ requestKey: null });
    setUsers(request);
  }

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <p className='text-2xl md:text-3xl font-semibold py-2 text-'>Admin</p>
      <Button onClick={() => setCreateUserOpen(true)}>
        <Plus className='mr-2' size='1.3em' />
        Create User
      </Button>
      <div className='flex flex-col gap-2 my-3'>
        {users[0] ? (
          users.map((user: any) => {
            if (user.id != pb.authStore.model?.id) {
              return (
                <UserItem
                  fetchUsers={fetchUsers}
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  role={user.role}
                  email={user.email}
                  created={user.created}
                />
              );
            }
          })
        ) : (
          <>
            <div className='flex flex-col m-3 gap-4'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <Skeleton className='h-4 w-[150px]' />
              </div>
              <Skeleton className='h-4 w-[250px]' />
              <Skeleton className='h-4 w-[150px]' />
              <div className='flex gap-2 w-full'>
                <Skeleton className='h-10 rounded-lg w-full' />
                <Skeleton className='h-10 rounded-lg w-full' />
              </div>
            </div>
            <div className='flex flex-col m-3 gap-4'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <Skeleton className='h-4 w-[150px]' />
              </div>
              <Skeleton className='h-4 w-[250px]' />
              <Skeleton className='h-4 w-[150px]' />
              <div className='flex gap-2 w-full'>
                <Skeleton className='h-10 rounded-lg w-full' />
                <Skeleton className='h-10 rounded-lg w-full' />
              </div>
            </div>
          </>
        )}
      </div>
      <CreateUserDrawer
        open={createUserOpen}
        setOpen={setCreateUserOpen}
        fetchUsers={fetchUsers}
      />
    </div>
  );
}

export default Admin;
