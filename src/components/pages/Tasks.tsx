import { pb } from "@/lib/pocketbase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Tasks() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
  }, []);
  return <>Tasks</>;
}

export default Tasks;
