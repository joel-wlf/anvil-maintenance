import clsx from "clsx";
import { FunctionComponent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";
import { useContext } from "react";
import { MenuModeContext } from "@/App";

interface MobileMenuItemProps {
  icon: ReactNode;
  title: string;
  to: string;
  child: number;
  setMenuOpen: (value: boolean) => void;
}

const MobileMenuItem: FunctionComponent<MobileMenuItemProps> = ({
  icon,
  title,
  to,
  child,
  setMenuOpen,
}) => {
  const navigate = useNavigate();

  const setMenuMode = useContext(MenuModeContext).setMode;

  const delay = child * 50;

  function navigateTo(route: string) {
    setMenuMode("normal");
    navigate(route);
  }

  function handleClick() {
    setMenuOpen(false);
    navigateTo(to);
  }

  return (
    <>
      {child != 1 && (
        <Separator
          className='fadein'
          style={{ animationDelay: `${delay}ms` }}
        />
      )}
      <div
        className={clsx("flex fadein gap-2 py-5", { "pt-1": child == 1 })}
        style={{ animationDelay: `${delay}ms` }}
        onClick={handleClick}
      >
        {icon}
        {title}
      </div>
    </>
  );
};

export default MobileMenuItem;
