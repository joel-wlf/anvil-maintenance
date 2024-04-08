import { pb } from "@/lib/pocketbase";
import {
  Anvil,
  Compass,
  LogOut,
  Settings,
  LayoutDashboard,
  LandPlot,
  CheckCircle,
  FileBadge,
  ShieldHalf,
  MenuIcon,
  X,
  ArrowLeft,
} from "lucide-react";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MenuItem from "@/components/MenuItem";
import { MenuModeContext } from "@/App";
import MobileMenuItem from "@/components/MobileMenuItem";

interface MenuProps {
  children: React.ReactNode;
}

const Menu: FunctionComponent<MenuProps> = ({ children }) => {
  const backendUrl: () => string = () => {
    return localStorage.getItem("backendUrl") || "";
  };

  const navigate = useNavigate();

  const menuMode = useContext(MenuModeContext).mode;

  const setMenuMode = useContext(MenuModeContext).setMode;

  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((prevState) => !prevState);
  }

  function navigateTo(route: string) {
    setMenuMode("normal")
    navigate(route)
  }

  function logout() {
    pb.authStore.clear();
    navigate("/login");
  }

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [menuOpen]);

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
            <Button
              className='w-full'
              variant='outline'
              onClick={() => navigateTo("/settings")}
            >
              <Settings className='mr-2' size='1.3em' />
              Settings
            </Button>
            <Button className='w-full' variant='outline' onClick={logout}>
              <LogOut className='mr-2' size='1.3em' />
              Log Out
            </Button>
          </div>
          <Separator />
          <MenuItem
            icon={<LayoutDashboard className='mr-3' size='1.3em' />}
            title='Dashboard'
            to='/dashboard'
          />
          <MenuItem
            icon={<CheckCircle className='mr-3' size='1.3em' />}
            title='Tasks'
            to='/tasks'
          />
          <MenuItem
            icon={<LandPlot className='mr-3' size='1.3em' />}
            title='Facility'
            to='/facility'
          />
          <MenuItem
            icon={<FileBadge className='mr-3' size='1.3em' />}
            title='Documentation'
            to='/documentation'
          />
          {pb.authStore.model?.role == "admin" && (
            <MenuItem
              icon={<ShieldHalf className='mr-3' size='1.3em' />}
              title='Admin'
              to='/admin'
            />
          )}
        </div>
        <div className='w-4/5 h-full p-5'>{children}</div>
      </div>
      <div className='md:hidden before:block before:h-[10vh]'>
        {!menuOpen ? (
          <nav className='flex color-[#adadad] items-center px-5 py-6 fixed top-0 left-0 h-[10vh] w-full z-50 saturate-150 backdrop-blur-sm border-b-[#333] border-b-[1px]'>
            {menuMode == "normal" ? (
              <>
                <Anvil className='fadein mr-2' size='1.7em' />
                <p className='fadein text-white mr-auto font-semibold'>
                  {pb.authStore.model?.name}
                </p>
              </>
            ) : (
              <>
                <Button
                  variant='ghost'
                  className='p-1 m-0 fadedown mr-auto'
                  onClick={() => navigateTo("/tasks")}
                >
                  <ArrowLeft color='#adadad' />
                </Button>
              </>
            )}

            <Button
              variant='ghost'
              className='p-[5px] m-0 fadedown'
              onClick={toggleMenu}
            >
              <MenuIcon color='#adadad' />
            </Button>
          </nav>
        ) : (
          <>
            <div className='fixed h-[110vh] w-lvw -top-[10vh] backdrop-blur-sm bg-[#000000AA]'></div>
            <nav className='flex items-center px-5 py-6 fixed top-0 left-0 h-[10vh] w-full z-50'>
              <Anvil className='fadedown mr-2 delay-500' size='1.7em' />
              <p className='fadedown mr-auto delay-100 font-semibold'>Anvil</p>
              <Button
                variant='ghost'
                className='p-[5px] h-[48px] m-0 fadein'
                onClick={logout}
              >
                <LogOut color='#adadad' />
              </Button>
              <Button
                variant='ghost'
                className='p-[5px] h-[48px] m-0 fadein'
                onClick={() => setMenuOpen(false)}
              >
                <X color='#adadad' />
              </Button>
            </nav>
            <div className='fixed top-[10vh] w-lvw h-[90vh] px-5 text-[#adadad]'>
              <MobileMenuItem
                title='Dashboard'
                icon={<LayoutDashboard />}
                to='/dashboard'
                child={1}
                setMenuOpen={setMenuOpen}
              />
              <MobileMenuItem
                title='Tasks'
                icon={<CheckCircle />}
                to='/tasks'
                child={2}
                setMenuOpen={setMenuOpen}
              />
              <MobileMenuItem
                title='Facility'
                icon={<LandPlot />}
                to='/facility'
                child={3}
                setMenuOpen={setMenuOpen}
              />
              <MobileMenuItem
                title='Documentation'
                icon={<FileBadge />}
                to='/documentation'
                child={4}
                setMenuOpen={setMenuOpen}
              />
              <MobileMenuItem
                title='Settings'
                icon={<Settings />}
                to='/settings'
                child={5}
                setMenuOpen={setMenuOpen}
              />
              {pb.authStore.model?.role == "admin" && (
                <MobileMenuItem
                  title='Admin'
                  icon={<ShieldHalf />}
                  to='/admin'
                  child={6}
                  setMenuOpen={setMenuOpen}
                />
              )}
            </div>
          </>
        )}
        <div className='m-3'>{children}</div>
      </div>
    </>
  );
};

export default Menu;
