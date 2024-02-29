import { FunctionComponent, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

interface MenuItemProps {
  title: string;
  icon: ReactNode;
  to: string;
}

const MenuItem: FunctionComponent<MenuItemProps> = (props) => {
  const location = useLocation();

  const navigate = useNavigate();

  return (
    <div
      className={clsx(
        "flex flex-row justify-start items-center cursor-pointer w-full p-2 hover:bg-[#222] rounded-lg transition-all",
        { "bg-[#222]": location.pathname == props.to }
      )}
      onClick={() => navigate(props.to)}
    >
      {props.icon}
      {props.title}
    </div>
  );
};

export default MenuItem;
