import { pb } from "@/lib/pocketbase";
import { Anvil, Compass, LogOut, Settings } from "lucide-react";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

interface MenuProps {
  children: React.ReactNode;
}

const Menu: FunctionComponent<MenuProps> = ({ children }) => {
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
        <div className='w-72 h-full border-r border-[#222] p-3 flex flex-col gap-3'>
          <div className='flex justify-start items-center gap-3 p-3 pb-1'>
            <Anvil size={64} />
            <h2 className='font-bold text-3xl'>{pb.authStore.model?.name}</h2>
          </div>
          <Card className='flex justify-center items-center p-2'>
            <Compass className='mr-2 w-10' size='1.3em' />
            <code className='text-ellipsis text-sm underline underline-offset-2'>
              {backendUrl()}
            </code>
          </Card>
          <div className='flex w-full gap-2'>
            <Button className='w-full' variant='outline'>
              <Settings className='mr-2' size='1.3em' />
              Settings
            </Button>
            <Button className='w-full' variant='outline' onClick={logout}>
              <LogOut className='mr-2' size='1.3em' />
              Log Out
            </Button>
          </div>
          <Separator />
        </div>
        <div className='w-4/5 h-full'>{children}</div>
      </div>
    </>
  );
};

export default Menu;
