import { pb } from "@/lib/pocketbase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function Tasks() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
  }, []);
  return (
    <div>
      <p className='text-2xl md:text-3xl font-semibold md:pt-2'>Tasks</p>
      <Button
        variant='outline'
        className='my-3 w-full'
        onClick={() => navigate("/tasks/createTask")}
      >
        <Plus className='mr-2' size='1.3em' />
        Create Task
      </Button>
      
    </div>
  );
}

export default Tasks;
