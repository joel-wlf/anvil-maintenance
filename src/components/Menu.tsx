import { FunctionComponent, useState } from "react";
import pb from "@/lib/pocketbase";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface Props {
  children: React.ReactNode;
}

const Menu: FunctionComponent<Props> = ({ children }) => {
  const backendUrl: () => string = () => {
    return localStorage.getItem("backendUrl") || "";
  };

  const navigate = useNavigate();

  if (pb.authStore.model?.role == "admin") {
    console.log("admin");
  }

  function logout() {
    pb.authStore.clear();
    navigate("/login");
  }

  return (
    <>
      <div className='hidden md:flex h-lvh w-lvw'>
        <div className='w-1/5 h-full border-r border-gray-500'>
          <h2 className='font-bold text-50'>{pb.authStore.model?.name}</h2>
          <code>{backendUrl()}</code>
          <Button onClick={logout}>Log Out</Button>
        </div>
        <div className='w-4/5 h-full'>{children}</div>
      </div>
    </>
  );
};

export default Menu;
