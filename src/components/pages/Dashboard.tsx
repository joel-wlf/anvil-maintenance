import pb from "@/lib/pocketbase"; 
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
  }, []);
  return (
  <>
    Hello {pb.authStore.model?.name && pb.authStore.model.name}
    <Button onClick={() => pb.authStore.clear()}>log out</Button>
  </>
  )
}

export default Dashboard;
