import pb from "@/lib/pocketbase"; 
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
  }, []);
  return (
  <>
    Hello {pb.authStore.isValid && pb.authStore.model?.name && pb.authStore.model.name}
    <button onClick={() => pb.authStore.clear()}>log out</button>
  </>
  )
}

export default Dashboard;
