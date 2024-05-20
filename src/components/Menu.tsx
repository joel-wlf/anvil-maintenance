import MenuItem from "@/components/MenuItem";
import MobileMenuItem from "@/components/MobileMenuItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pb } from "@/lib/pocketbase";
import {
  Anvil,
  ArrowLeft,
  CheckCircle,
  Compass,
  FileBadge,
  LandPlot,
  LayoutDashboard,
  LogOut,
  MenuIcon,
  Settings,
  ShieldHalf,
  X,
} from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuProps {
  children: React.ReactNode;
}

const Menu: FunctionComponent<MenuProps> = ({ children }) => {
    const { t } = useTranslation(["translation"]);

  const backendUrl: () => string = () => {
    return localStorage.getItem("backendUrl") || "";
  };

  const navigate = useNavigate();

  const location = useLocation();

  const { pathname } = location;

  const tasksPattern = /^\/tasks(\/.*)?(?<!\/tasks)$/;

  const workflowPattern = /^\/workflow(\/.*)?(?<!\/workflow)$/;

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
            <Button
              className='w-full'
              variant='outline'
              onClick={() => navigate("/settings")}
            >
              <Settings className='mr-2' size='1.3em' />
              Settings{t("menu.settings")}
            </Button>
            <Button className='w-full' variant='outline' onClick={logout}>
              <LogOut className='mr-2' size='1.3em' />
              {t("menu.log_out")}
            </Button>
          </div>
          <Separator />
          <MenuItem
            icon={<LayoutDashboard className='mr-3' size='1.3em' />}
            title={t("menu.dashboard")}
            to='/dashboard'
          />
          <MenuItem
            icon={<CheckCircle className='mr-3' size='1.3em' />}
            title={t("menu.tasks")}
            to='/tasks'
          />
          <MenuItem
            icon={<LandPlot className='mr-3' size='1.3em' />}
            title={t("menu.facility")}
            to='/facility'
          />
          <MenuItem
            icon={<FileBadge className='mr-3' size='1.3em' />}
            title={t("menu.facility")}
            to='/documentation'
          />
          {pb.authStore.model?.role == "admin" && (
            <MenuItem
              icon={<ShieldHalf className='mr-3' size='1.3em' />}
              title={t("menu.admin")}
              to='/admin'
            />
          )}
        </div>
        <div className='w-4/5 h-full p-5'>{children}</div>
      </div>
      <div className='md:hidden before:block before:h-[10vh]'>
        {!menuOpen ? (
          <nav className='flex color-[#adadad] items-center px-5 py-6 fixed top-0 left-0 h-[10vh] w-full z-50 saturate-150 backdrop-blur-sm border-b-[#333] border-b-[1px]'>
            {!tasksPattern.test(pathname) && !workflowPattern.test(pathname) ? (
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
                  onClick={() => navigate("/tasks")}
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
                title={t("menu.dashboard")}
                icon={<LayoutDashboard />}
                to='/dashboard'
                child={1}
                setMenuOpen={setMenuOpen}
              />
              <MobileMenuItem
                title={t("menu.tasks")}
                icon={<CheckCircle />}
                to='/tasks'
                child={2}
                setMenuOpen={setMenuOpen}
              />
              <MobileMenuItem
                title={t("menu.facility")}
                icon={<LandPlot />}
                to='/facility'
                child={3}
                setMenuOpen={setMenuOpen}
              />
              <MobileMenuItem
                title={t("menu.documentation")}
                icon={<FileBadge />}
                to='/documentation'
                child={4}
                setMenuOpen={setMenuOpen}
              />
              <MobileMenuItem
                title={t("menu.settings")}
                icon={<Settings />}
                to='/settings'
                child={5}
                setMenuOpen={setMenuOpen}
              />
              {pb.authStore.model?.role == "admin" && (
                <MobileMenuItem
                  title={t("menu.admin")}
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
