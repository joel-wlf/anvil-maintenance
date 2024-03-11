import { Button } from "@/components/ui/button";
import CreateUserDrawer from "@/components/CreateUserDrawer";
import { pb } from "@/lib/pocketbase";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any | null>(null);

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
    console.log(users);
  }, []);

  return (
    <div>
      <p className='text-2xl md:text-3xl font-semibold px-3 py-2 text-'>
        Admin
      </p>
      <Button onClick={() => setCreateUserOpen(true)}>
        <Plus className='mr-2' size='1.3em' />
        Create User
      </Button>
      <CreateUserDrawer
        open={createUserOpen}
        setOpen={setCreateUserOpen}
        setUsers={setUsers}
      />
    </div>
  );
}

export default Admin;
