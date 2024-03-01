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
} from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import MenuItem from "./MenuItem";

interface MenuProps {
  children: React.ReactNode;
}

const Menu: FunctionComponent<MenuProps> = ({ children }) => {
  const backendUrl: () => string = () => {
    return localStorage.getItem("backendUrl") || "";
  };

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((prevState) => !prevState);
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
        <div className='w-4/5 h-full'>{children}</div>
      </div>
      <div className='md:hidden before:block before:h-[10vh]'>
        {!menuOpen ? (
          <nav className='flex color-[#adadad] items-center px-5 py-6 fixed top-0 left-0 bg-[rgba(0, 0, 0, 0.85)] h-[10vh] w-full z-50 saturate-150 backdrop-blur-sm border-b-[#333] border-b-[1px]'>
            <Anvil className='fadedown mr-2 delay-150' size='1.7em' />
            <p className='delay-[50ms] text-white mr-auto font-semibold fadedown'>
              {pb.authStore.model?.name}
            </p>
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
            <div className='fixed h-[110vh] w-lvw -top-[10vh]  backdrop-blur-sm saturate-150'></div>
            <nav className='flex color-[#adadad] items-center px-5 py-6 fixed top-0 left-0 bg-[rgba(0, 0, 0, 0.85)] h-[10vh] w-full z-50'>
              {/* <User
                name='Joel Wolf'
                src='./profile-pic.jpeg'
                className='fadein'
                style={{ animationDelay: "50ms" }}
                marginRight='auto'
              /> */}
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
            {/* <main className='menu'>
              <Grid.Container gap={0}>
                <MenuItem
                  icon={<LayoutDashboard />}
                  text='Dashboard'
                  page='/'
                  child='1'
                />
                <MenuItem
                  icon={<Newspaper />}
                  text='News'
                  page='/news'
                  child='2'
                />
                <MenuItem
                  icon={<Home />}
                  text='My Home'
                  page='/home'
                  child='4'
                />
                <MenuItem
                  icon={<CarFront />}
                  text='My Car'
                  page='/car'
                  child='5'
                />
                <MenuItem
                  icon={<Ticket />}
                  text='Services'
                  page='/services'
                  child='6'
                />
              </Grid.Container>
            </main> */}
          </>
        )}
        {children}
      </div>
    </>
  );
};

export default Menu;
