import { pb } from "@/lib/pocketbase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Documentation() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
  }, []);
  return <>Documentation</>;
}

export default Documentation;
