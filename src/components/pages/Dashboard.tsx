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
    Dashboard
  </>
  )
}

export default Dashboard;
