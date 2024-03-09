import { pb } from "@/lib/pocketbase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

function Admin() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any | null>(null);

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
    console.log(users)
  }, []);

  return (
    <div>
      <p className='text-2xl md:text-3xl font-semibold px-3 py-2 text-'>
        Admin
      </p>
      <Button>
        <Plus className='mr-2' size='1.3em' />
        Create User
      </Button>
    </div>
  );
}

export default Admin;
